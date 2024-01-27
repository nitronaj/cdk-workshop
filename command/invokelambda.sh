#!/bin/bash

# invoke lambda
aws lambda invoke \   ✔
--function-name FUNCATION_NAME \
	--invocation-type RequestResponse \
	--payload file://input.json \
	--cli-binary-format raw-in-base64-out /dev/stdout 2>/dev/null | jq
