// server/src/lib/dbUtils.ts

import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export async function correctPKFormat(docClient: DynamoDBDocumentClient, tableName: string, userId: string, modelName: string) {
  const oldPK = `USER#USER#${userId}`;
  const newPK = `USER#${userId}`;
  const SK = `MODEL#${modelName}`;

  // Check if item with old PK exists
  const getCommand = new GetCommand({
    TableName: tableName,
    Key: {
      PK: oldPK,
      SK: SK
    }
  });

  const getResponse = await docClient.send(getCommand);

  if (getResponse.Item) {
    // Item with old PK exists, let's correct it
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        ...getResponse.Item,
        PK: newPK
      }
    });

    await docClient.send(putCommand);

    // Delete the old item
    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: {
        PK: oldPK,
        SK: SK
      }
    });

    await docClient.send(deleteCommand);

    console.log(`Corrected PK for model: ${modelName}`);
  } else {
    console.log(`No correction needed for model: ${modelName}`);
  }
}