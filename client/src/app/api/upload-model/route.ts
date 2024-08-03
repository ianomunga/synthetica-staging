
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

async function migrateData(docClient: DynamoDBDocumentClient, tableName: string, userId: string, modelName: string) {
  const oldPK = `USER#USER#${userId}`;
  const newPK = `USER#${userId}`;
  const SK = `MODEL#${modelName}`;

  const scanCommand = new ScanCommand({
    TableName: tableName,
    FilterExpression: "PK = :pk AND SK = :sk",
    ExpressionAttributeValues: {
      ":pk": oldPK,
      ":sk": SK
    }
  });

  const scanResponse = await docClient.send(scanCommand);

  if (scanResponse.Items && scanResponse.Items.length > 0) {
    const item = scanResponse.Items[0];
    
    // Create new item with correct PK
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        ...item,
        PK: newPK
      }
    });

    await docClient.send(putCommand);

    // Delete old item
    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: {
        PK: oldPK,
        SK: SK
      }
    });

    await docClient.send(deleteCommand);

    console.log(`Migrated item for model: ${modelName}`);
  }
}

export async function POST(request: Request) {
    const formData = await request.formData();
    console.log('Received form data:', Object.fromEntries(formData));
    const file = formData.get('file') as File;
    const codeFile = formData.get('codeFile') as File;
    const modelName = formData.get('modelName') as string;
    const modality = formData.get('modality') as string;
    const dataIntegrityTags = JSON.parse(formData.get('dataIntegrityTags') as string);
    const userId = formData.get('userId') as string;
    const username = formData.get('username') as string;
    const lastUpdated = formData.get('lastUpdated') as string;

    try {
        // Upload weights file to S3
        const weightsFileBuffer = await file.arrayBuffer();
        const weightsS3Key = `models/${userId}/${modelName}/weights`;
        const weightsS3Params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: weightsS3Key,
          Body: Buffer.from(weightsFileBuffer),
        };
        await s3Client.send(new PutObjectCommand(weightsS3Params));
    
        // Upload code file to S3
        const codeFileBuffer = await codeFile.arrayBuffer();
        const codeS3Key = `models/${userId}/${modelName}/code`;
        const codeS3Params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: codeS3Key,
          Body: Buffer.from(codeFileBuffer),
        };
        await s3Client.send(new PutObjectCommand(codeS3Params));
    
        // Determine model status
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const status = new Date(lastUpdated) > threeMonthsAgo ? 'Active' : 'Inactive';

        // Save model metadata to DynamoDB
        const dynamoParams = {
          TableName: process.env.DYNAMODB_TABLE_NAME!,
          Item: {
            PK: `USER#${userId}`,
            SK: `MODEL#${modelName}`,
            modelName,
            modality,
            dataIntegrityTags: dataIntegrityTags.join(','),
            status,
            lastUpdated,
            username,
            weightsS3Key,
            codeS3Key,
          },
        };
        console.log('Saving to DynamoDB:', dynamoParams);
        await docClient.send(new PutCommand(dynamoParams));

        // Run migration script
        try {
            const scriptPath = path.join(process.cwd(), 'scripts', 'migrate-dynamodb.ts');
            const { stdout, stderr } = await execAsync(`npx ts-node "${scriptPath}"`);
            console.log('Migration script output:', stdout);
            if (stderr) console.error('Migration script error:', stderr);
        } catch (error) {
            console.error('Error running migration script:', error);
        }

        console.log('Model uploaded and migration attempted');
        return NextResponse.json({ message: 'Model uploaded and migration attempted' });
    } catch (error) {
        console.error('Error uploading model:', error);
        return NextResponse.json({ message: 'Error uploading model' }, { status: 500 });
    }
}

