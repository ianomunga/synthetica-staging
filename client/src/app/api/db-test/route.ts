//client\src\app\api\db-test\route.ts
import { NextResponse } from 'next/server';
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  console.log('Environment variables:');
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '[REDACTED]' : 'undefined');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '[REDACTED]' : 'undefined');
  console.log('DYNAMODB_TABLE_NAME:', process.env.DYNAMODB_TABLE_NAME);

  try {
    const clientConfig: DynamoDBClientConfig = {
      region: process.env.AWS_REGION,
    };

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      clientConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    const client = new DynamoDBClient(clientConfig);

    const docClient = DynamoDBDocumentClient.from(client);

    const tableName = process.env.DYNAMODB_TABLE_NAME;

    if (!tableName) {
      throw new Error('DYNAMODB_TABLE_NAME is not defined in environment variables');
    }

    const command = new ScanCommand({
      TableName: tableName,
      Limit: 1,
    });

    const response = await docClient.send(command);
    
    console.log('Query result:', response.Items);

    return NextResponse.json({ message: 'Database connection successful', result: response.Items });
  } catch (error) {
    console.error('Database connection error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Database connection failed', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}