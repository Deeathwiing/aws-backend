import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 } from "uuid";

import productService from "../../services";
import { APIGatewayProxyResult, SQSEvent} from "aws-lambda";

import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: 'eu-central-1' });


export const catalogBatchProcessHandler = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
  console.log('Incoming Event', event);
  try {
    const newProducts = event.Records.map( ({ body}) => JSON.parse(body));
    for (const newProduct of newProducts) {
      const id = v4();
      // @ts-ignore
      const {title, description, count, price} = newProduct;

      if(!title || !description || !count || !price) {formatJSONResponse({
        status: 400,
        message: 'Invalid post data'
      });
      }

      const product = await productService.createProduct({
        id,
        title,
        description,
        count: +count,
        price: +price,
      });
      console.log('Created Product', product);
      const params = { Message: JSON.stringify(product), TopicArn: process.env.SNS_ARN, Subject: 'Hello'};

      snsClient.send(new PublishCommand(params), (err) => console.log(err));
      
    }


    return formatJSONResponse({
      status: 200,
      newProducts
    });
  } catch (e) {
    console.log('Error', e);
    
    return formatJSONResponse({
      status: 500,
      message: e
    });
  }
};

export const catalogBatchProcess = middyfy(catalogBatchProcessHandler);
