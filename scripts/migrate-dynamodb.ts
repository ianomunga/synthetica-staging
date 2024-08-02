// scripts/migrate-dynamodb.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('DYNAMODB_TABLE_NAME:', process.env.DYNAMODB_TABLE_NAME);

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

async function migrateData() {
  const scanCommand = new ScanCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    FilterExpression: "begins_with(PK, :prefix)",
    ExpressionAttributeValues: {
      ":prefix": "USER#USER#"
    }
  });

  try {
    const scanResponse = await docClient.send(scanCommand);
    
    console.log('Items found:', scanResponse.Items?.length);

    for (const item of scanResponse.Items || []) {
      // Create new item with correct PK
      const newPK = item.PK.replace("USER#USER#", "USER#");
      const putCommand = new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          ...item,
          PK: newPK
        }
      });

      await docClient.send(putCommand);
      console.log(`Created new item with PK: ${newPK}`);

      // Delete old item
      const deleteCommand = new DeleteCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
          PK: item.PK,
          SK: item.SK
        }
      });

      await docClient.send(deleteCommand);
      console.log(`Deleted old item with PK: ${item.PK}`);
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  }
}

migrateData();