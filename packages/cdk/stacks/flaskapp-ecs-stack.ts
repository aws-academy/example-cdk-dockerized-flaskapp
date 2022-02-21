import { aws_ecs_patterns, Stack, StackProps } from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";
import { resolve } from "path";

interface FlaskappEcsStackProps {
  vpc: Vpc;
}

export class FlaskappEcsStack extends Stack {
  constructor(scope: Construct, id: string, myProps: FlaskappEcsStackProps, props?: StackProps) {
    super(scope, id, props);

    const cluster = new Cluster(this, "Cluster", { vpc: myProps.vpc });

    // uploaded to an S3 staging bucket prior to being uploaded to ECR.
    // A new repository is created in ECR and the Fargate service is created
    // with the image from ECR.
    const loadBalancedFargateService = new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "FargateService",
      {
        cluster,
        memoryLimitMiB: 512,
        cpu: 256,
        desiredCount: 1,
        taskImageOptions: {
          containerName: "MyFlaskappContainer",
          image: ContainerImage.fromAsset(resolve(__dirname, "..", "..", "flaskapp")),
        },
        // In this setup this is required. For more info see the stackoverflow post:
        // https://stackoverflow.com/questions/61265108/aws-ecs-fargate-resourceinitializationerror-unable-to-pull-secrets-or-registry
        assignPublicIp: true,
      }
    );

    loadBalancedFargateService.service.autoScaleTaskCount({
      minCapacity: 0,
      maxCapacity: 1,
    });
  }
}
