// client/src/app/api/upload-model/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Readable } from 'stream';
import { correctPKFormat } from '../../../../../server/src/lib/dbUtils';

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
          TableName: process.env.DYNAMODB_TABLE_NAME,
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

        // Correct PK format if necessary
        await correctPKFormat(docClient, process.env.DYNAMODB_TABLE_NAME!, userId, modelName);

        console.log('Model uploaded successfully');
        return NextResponse.json({ message: 'Model uploaded successfully' });
      } catch (error) {
        console.error('Error uploading model:', error);
        return NextResponse.json({ message: 'Error uploading model' }, { status: 500 });
      }
    }

    