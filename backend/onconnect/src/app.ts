import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
  endpoint: 'http://dynamodb:8000',
});

const EXPIRY_TIME_IN_HOUR = process.env.EXPIRY_TIME_IN_HOUR || '1';
const TABLE_NAME = process.env.TABLE_NAME || 'scrum_poker';

// TODO export name needs to be updated in deployment as well, but only lambdaHandler seems to work out of the box
export const lambdaHandler: APIGatewayProxyHandler = async (event) => {
  process.stdout.write('=> Event\n');
  process.stdout.write(JSON.stringify(event));
  process.stdout.write('\n<= Event\n');

  // TODO Just create the table on each run, we can fix this later once it works
  const db = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION,
    endpoint: 'http://dynamodb:8000',
  });

  process.stdout.write('=> Create Table\n');
  await new Promise((resolve, reject) => {
    db.createTable(
      {
        TableName: TABLE_NAME,
        AttributeDefinitions: [{ AttributeName: 'primaryKey', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'primaryKey', KeyType: 'HASH' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        SSESpecification: {
          Enabled: true,
        },
      },
      function (err, data) {
        if (err) {
          console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
          reject(err);
        } else {
          console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
          resolve(data);
        }
      }
    );
  });
  process.stdout.write('<= Created Table\n');

  const expiryDate = new Date(Date.now());
  expiryDate.setHours(expiryDate.getHours() + parseFloat(EXPIRY_TIME_IN_HOUR));
  const putParams = {
    TableName: TABLE_NAME,
    Item: {
      primaryKey: `connectionId:${event.requestContext.connectionId}`,
      connectionId: event.requestContext.connectionId,
      ttl: Math.floor(expiryDate.getDate() / 1000),
    },
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
