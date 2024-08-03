// client/src/app/api/delete-model/route.ts
import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

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
  const { userId, modelName } = await request.json();

  try {
    // Delete weights file from S3
    const weightsS3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `models/${userId}/${modelName}/weights`,
    };
    await s3Client.send(new DeleteObjectCommand(weightsS3Params));

    // Delete code file from S3
    const codeS3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `models/${userId}/${modelName}/code`,
    };
    await s3Client.send(new DeleteObjectCommand(codeS3Params));

    // Delete model metadata from DynamoDB
    const dynamoParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `MODEL#${modelName}`,
      },
    };
    await docClient.send(new DeleteCommand(dynamoParams));

    console.log(`Model ${modelName} deleted successfully for user ${userId}`);
    return NextResponse.json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json({ message: 'Error deleting model', error: String(error) }, { status: 500 });
  }
}