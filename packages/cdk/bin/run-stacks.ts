#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { FlaskappEcsStack } from "../stacks/flaskapp-ecs-stack";
import { VpcStack } from "../stacks/vpc-stack";

if (!process.env.CDK_DEFAULT_ACCOUNT || !process.env.CDK_DEFAULT_REGION) {
  throw new Error(
    "Missing region and account info. Make sure you have configured AWS CLI profile."
  );
}
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

let vpcStack = new VpcStack(app, "FlaskApp-VPC-Stack", { env });

new FlaskappEcsStack(
  app,
  "FlaskApp-ECS-Stack",
  {
    vpc: vpcStack.vpc,
  },
  { env }
);
