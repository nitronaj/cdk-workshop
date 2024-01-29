const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// Set the AWS Region.
// const REGION = 'REGION'; // e.g. "us-east-1"
// Create an Amazon Lambda service client object.
const dynamoClient = new DynamoDBClient();
module.exports = { dynamoClient };
