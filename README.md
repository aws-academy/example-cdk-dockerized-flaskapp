# Example CDK dockerized Flask app

This repository contains an example of how CDK can be used to deploy a
dockerized application (in this case a python flask app) into AWS.

The app will
- build the docker image from `packages/flaskapp`
- upload the image to ECR
- create a VPC with public subnet in two availability zones
- create an application load balancer
- create a fargate cluster that executes the uploaded docker image as task

The deployed app will listen on port 80 and when deployed will output an URL
that can be used to check if the flask app is working.

## Prerequisites

- Node.js
- AWS CLI
  - with a working profile for the account you want to deploy in
- CDK CLI

## Getting started

### 1. Clone the repository

```
git clone git@github:aws-academy/example-cdk-dockerized-flaskapp.git
```

### 2. Install npm dependencies

```
npm run bootstrap
```

### 3. Deploy

```
npm run deploy -- --profile <your_account_profile>
```

### 4. Test

Go to URL that was outputted by runnin CDK or check the URL in
`AWS Console -> CloudFormation -> FlaskApp-ECS-Stack -> Outputs`.

### 5. Destroy

The following should destroy all created resources **except** the image in the ECR.

npm run destroy -- --profile <your_account_profile>

If you want to get rid of that it needs to be deleted manually.
The image is in ECR at a reposity called something like
`cdk-abc1234-container-assets-123456789-eu-west-1`.

CDK creates a mapping of assets for the EC2 stack in
`packages/cdk/cdk.out/FlaskApp-ECS-Stack.assets.json`. You can find the
imageTag that was created for the image there to be able to identify it.

There is a request for CDK garbage collection but at time of writing
it is not yet supported:

https://github.com/aws/aws-cdk-rfcs/issues/64


## How to create the CloudFormation template without deploying?

```
npm run synth -- --profile <your_account_profile>
```