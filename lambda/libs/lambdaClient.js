const { LambdaClient } = require('@aws-sdk/client-lambda');
// Set the AWS Region.

// Create an Amazon Lambda service client object.
const lambdaClient = new LambdaClient();
module.exports = { lambdaClient };
