import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from "@functions/importFileParser";

const serverlessConfiguration: AWS = {
  service: 'import-service-andrei-karotkin',
  frameworkVersion: '3',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    serverLessVariables: {
      BUCKET_NAME: 'import-service-bucket-andrei-karotkin',
      SQS_NAME: 'catalogItemsQueueAndreiKarotkin'
    }
  },
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: '${self:custom.serverLessVariables.BUCKET_NAME}',
      SQS_URL:  { Ref: '${self:custom.serverLessVariables.SQS_NAME}' },
      AUTHORIZER_ARN: 'arn:aws:lambda:eu-central-1:398158581759:function:auth-service-andrei-karotkin-dev-basicAuthorizer'
    },
    iam: {
      role: {
        permissionsBoundary: 'arn:aws:iam::${aws:accountId}:policy/eo_role_boundary',
        statements: [
            {
              Effect: 'Allow',
              Action: ['s3:*'],
              Resource: '*'
            },
            {
              Effect: 'Allow',
              Action: ['sqs:*'],
              Resource: {
                'Fn::GetAtt': ['${self:custom.serverLessVariables.SQS_NAME}', 'Arn'],
              },
            }]
      }
    },
  },
  resources: {
    extensions: {
      IamRoleCustomResourcesLambdaExecution: {
        Properties: {
          PermissionsBoundary: 'arn:aws:iam::${aws:accountId}:policy/eo_role_boundary'
        }
      }
    },
    Resources: {
      importServiceBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.serverLessVariables.BUCKET_NAME}',
          CorsConfiguration: {
            CorsRules: [{
              AllowedHeaders: ['*'],
              AllowedMethods: ['GET','PUT','POST','DELETE'],
              AllowedOrigins: ['*']
            }]
          }
        },
      },
      importServiceBucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:custom.serverLessVariables.BUCKET_NAME}',
          PolicyDocument: {
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  AWS: '*',
                },
                Action: ['*'],
                Resource: [
                  'arn:aws:s3:::import-service-bucket-andrei-karotkin',
                  'arn:aws:s3:::import-service-bucket-andrei-karotkin/*',
                ],
              },
            ],
          },
        },
      },
      catalogItemsQueueAndreiKarotkin: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${self:custom.serverLessVariables.SQS_NAME}',
        },
      },
      catalogItemsQueueAndreiKarotkinPolicy: {
        Type: 'AWS::SQS::QueuePolicy',
        Properties: {
          Queues: [{ Ref: '${self:custom.serverLessVariables.SQS_NAME}' }],
          PolicyDocument: {
            Statement: [
              {
                Action: ['sqs:*'],
                Effect: 'Allow',
                Resource: '*',
              },
            ],
          },
        },
      },
    }
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },

};

module.exports = serverlessConfiguration;
