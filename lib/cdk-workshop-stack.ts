import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import {  Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TableViewer } from 'cdk-dynamo-table-viewer';

import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends Stack {
	public readonly hcEndpoint: cdk.CfnOutput;
  public readonly hcViewerUrl: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

		// defines an AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'hello.handler'                // file is "hello", function is "handler"
    });

		const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

	// defines an API Gateway REST API resource backed by our "hello" function.
    const gateway = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });

		const tv = new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
			sortBy: "-hits"
    });

		this.hcEndpoint = new cdk.CfnOutput(this, 'GatewayUrl', {
      value: gateway.url
    });

    this.hcViewerUrl = new cdk.CfnOutput(this, 'TableViewerUrl', {
      value: tv.endpoint
    });

  }
}
