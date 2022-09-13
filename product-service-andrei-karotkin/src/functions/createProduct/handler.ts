import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 } from "uuid";

import productService from "../../services";
import {APIGatewayProxyEvent, APIGatewayProxyResult,} from "aws-lambda";


export const createProductHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Incoming Event', event);
  try {
    const id = v4();
    const product = await productService.createProduct({
      id,
      // @ts-ignore
      title: event.body.title,
      // @ts-ignore
      description: event.body.description,
      // @ts-ignore
      count: event.body.count,
      // @ts-ignore
      price: event.body.price,
    })
    return formatJSONResponse({
      product
    });
  } catch (e) {
    return formatJSONResponse({
      status: 500,
      message: e
    });
  }
};

export const createProduct = middyfy(createProductHandler);
