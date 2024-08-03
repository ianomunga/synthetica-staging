// scripts/upload-placeholder-metrics.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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

const placeholderMetrics = {
  "Accuracy" : "0.95",
  "Precision" : "0.92",
  "Recall" : "0.97",
  "F1 Score" : "0.94",
};

const models = [
  { name: "BCSegmentation", status: "Active", lastUpdated: "2023-05-15" },
  { name: "BCDensityEstimator", status: "Inactive", lastUpdated: "2023-05-10" },
  { name: "MalignancyRegression", status: "Active", lastUpdated: "2023-05-05" },
];

async function uploadPlaceholderMetrics() {
  for (const model of models) {
    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: `USER#admin@example.com`,
        SK: `MODEL#${model.name}`,
      },
      UpdateExpression: "SET modelName = :modelName, #status = :status, lastUpdated = :lastUpdated, performance_metrics = :metrics",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":modelName": model.name,
        ":status": model.status,
        ":lastUpdated": model.lastUpdated,
        ":metrics": placeholderMetrics,
      },
    });

    try {
      await docClient.send(command);
      console.log(`Updated placeholder metrics for ${model.name}`);
    } catch (error) {
      console.error(`Error updating ${model.name}:`, error);
    }
  }
}

uploadPlaceholderMetrics().then(() => console.log("Finished uploading placeholder metrics"));