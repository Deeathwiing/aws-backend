import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from "@functions/getProductsById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

const serverlessConfiguration: AWS = {
  service: 'product-service-andrei-karotkin',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    iam: {
      role: {
        permissionsBoundary: 'arn:aws:iam::${aws:accountId}:policy/eo_role_boundary',
        statements: [{
          Effect: 'Allow',
          Action: ['s3:*', 'dynamodb:*', 'sns:*'],
          Resource: '*'
        }]
      }
    },
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCT_TABLE_NAME: 'Products-Andrei-Karotkin',
      SQS_ARN: 'arn:aws:sqs:eu-central-1:398158581759:catalogItemsQueueAndreiKarotkin',
      SNS_TOPIC_NAME: 'topicAndreiKarotkin',
      SNS_ARN: { Ref: 'topicAndreiKarotkin' },
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct,catalogBatchProcess },
  package: { individually: true },
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
    'serverless-offline': {
      httpPort: 3303
    },
    dynamodb: {
      start: {
        port: 5000,
        inMemory: true,
        migrate: true,
      },
      stages: 'dev'
    }
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.PRODUCT_TABLE_NAME}",
          AttributeDefinitions: [{
            AttributeName: "id",
            AttributeType: "S",
          }, {
            AttributeName: "title",
            AttributeType: "S",
          },{
            AttributeName: "count",
            AttributeType: "N",
          },{
            AttributeName: "price",
            AttributeType: "N",
          },{
            AttributeName: "description",
            AttributeType: "S",
          }],
          KeySchema: [{
            AttributeName: "id",
            KeyType: "HASH"
          }
        ],
        GlobalSecondaryIndexes: [
        {
            IndexName: "trashIndex",
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "price",
                    KeyType: "RANGE"
                }
            ],
            Projection: {
              ProjectionType: "KEYS_ONLY"
            },
            ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        },
        {
            IndexName: "trashIndexTwo",
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "count",
                    KeyType: "RANGE"
                },
            ],
            Projection: {
              ProjectionType: "KEYS_ONLY"
            },
            ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        },
         {
            IndexName: "trashIndexThree",
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "description",
                    KeyType: "RANGE"
                },
            ],
            Projection: {
              ProjectionType: "KEYS_ONLY"
            },
            ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        },
        {
            IndexName: "trashIndexFour",
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "title",
                    KeyType: "RANGE"
                },
            ],
            Projection: {
              ProjectionType: "KEYS_ONLY"
            },
            ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
    ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
      },
      topicAndreiKarotkin: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                TopicName: '${self:provider.environment.SNS_TOPIC_NAME}',
            },
        },
      SNSSubscription: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Endpoint: 'andreykorotkins@gmail.com',
                Protocol: 'email',
                TopicArn: { Ref: '${self:provider.environment.SNS_TOPIC_NAME}' },
            },
        },
    }
  }
};

module.exports = serverlessConfiguration;
