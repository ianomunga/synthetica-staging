// server/src/lib/db.ts
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const clientConfig: DynamoDBClientConfig = {
  region: process.env.AWS_REGION,
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.DYNAMODB_TABLE_NAME;

if (!TableName) {
  throw new Error('DYNAMODB_TABLE_NAME is not defined in environment variables');
}

export interface User {
  PK: string;
  SK: string;
  email: string;
  name: string;
  hashedPassword: string;
  createdAt: string;
}

export interface Model {
  PK: string;
  SK: string;
  modelName: string;
  status: string;
  lastUpdated: string;
  modality: string;
  dataIntegrityTags: string;
  performance_metrics?: {
    [key: string]: string;
  };
  weightsS3Key: string;
  codeS3Key: string;
}


export async function getUser(email: string): Promise<User | undefined> {
  const command = new GetCommand({
    TableName,
    Key: {
      PK: `USER#${email}`,
      SK: `METADATA#${email}`,
    },
  });

  try {
    const response = await docClient.send(command);
    return response.Item as User | undefined;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function createUser(email: string, hashedPassword: string, name: string) {
  const command = new PutCommand({
    TableName,
    Item: {
      PK: `USER#${email}`,
      SK: `METADATA#${email}`,
      email,
      name,
      hashedPassword,
      createdAt: new Date().toISOString(),
    },
    ConditionExpression: 'attribute_not_exists(PK)',
  });

  try {
    await docClient.send(command);
    return { email, name };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserModels(email: string): Promise<Model[]> {
  console.log('getUserModels called with email:', email);
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '[REDACTED]' : 'undefined');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '[REDACTED]' : 'undefined');
  console.log('DYNAMODB_TABLE_NAME:', process.env.DYNAMODB_TABLE_NAME);

  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${email}`,
      ':sk': 'MODEL#',
    },
  });

  console.log('Query command:', JSON.stringify(command, null, 2));

  try {
    const response = await docClient.send(command);
    console.log('getUserModels response:', JSON.stringify(response, null, 2));
    return response.Items as Model[];
  } catch (error) {
    console.error('Error getting user models:', error);
    throw error;
  }
}

export async function addUserModel(email: string, modelName: string, modelData: any) {
  const command = new PutCommand({
    TableName,
    Item: {
      PK: `USER#${email}`,
      SK: `MODEL#${modelName}`,
      modelName,
      ...modelData,
      createdAt: new Date().toISOString(),
    },
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error('Error adding user model:', error);
    throw error;
  }
}

export async function removeUserModel(email: string, modelName: string) {
  const command = new DeleteCommand({
    TableName,
    Key: {
      PK: `USER#${email}`,
      SK: `MODEL#${modelName}`,
    },
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error('Error removing user model:', error);
    throw error;
  }
}

export async function updateModelStatus(email: string, modelName: string, status: string): Promise<void> {
  const command = new UpdateCommand({
    TableName,
    Key: {
      PK: `USER#${email}`,
      SK: `MODEL#${modelName}`,
    },
    UpdateExpression: 'SET #status = :status, lastUpdated = :lastUpdated',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':lastUpdated': new Date().toISOString(),
    },
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error('Error updating model status:', error);
    throw error;
  }
}

export async function getModelDetails(email: string, modelName: string): Promise<Model | undefined> {
  const command = new GetCommand({
    TableName,
    Key: {
      PK: `USER#${email}`,
      SK: `MODEL#${modelName}`,
    },
  });

  try {
    const response = await docClient.send(command);
    return response.Item as Model | undefined;
  } catch (error) {
    console.error('Error getting model details:', error);
    throw error;
  }
}

export async function updateModelMetrics(email: string, modelName: string, metrics: any): Promise<void> {
  const command = new UpdateCommand({
    TableName,
    Key: {
      PK: `USER#${email}`,
      SK: `MODEL#${modelName}`,
    },
    UpdateExpression: 'SET evalMetrics = :metrics, lastUpdated = :lastUpdated',
    ExpressionAttributeValues: {
      ':metrics': metrics,
      ':lastUpdated': new Date().toISOString(),
    },
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error('Error updating model metrics:', error);
    throw error;
  }
}