const { lambdaClient } = require('./libs/lambdaClient');
const { dynamoClient } = require('./libs/dynamoClient');

const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { InvokeCommand } = require('@aws-sdk/client-lambda');

exports.handler = async function (event) {
  console.log('request:', JSON.stringify(event, undefined, 2));

  // create AWS SDK clients
  // const dynamo = new DynamoDB();
  // const lambda = new Lambda();

  // update dynamo entry for "path" with hits++
  const updateCommand = new UpdateItemCommand({
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: 'ADD hits :incr',
    ExpressionAttributeValues: { ':incr': { N: '1' } },
  });
  await dynamoClient.send(updateCommand);

  // call downstream function and capture response
  const invokeCommand = new InvokeCommand({
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event),
  });
  const resp = await lambdaClient.send(invokeCommand);

  console.log('downstream response:', JSON.stringify(resp, undefined, 2));

  const result = Buffer.from(resp.Payload).toString();
  // return response back to upstream caller
  return JSON.parse(result);
};
