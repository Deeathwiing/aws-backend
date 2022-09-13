import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 } from "uuid";

import productService from "../../services";
import {APIGatewayProxyEvent, APIGatewayProxyResult,} from "aws-lambda";


export const createProductHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Incoming Event', event);
  try {
    const id = v4();
      // @ts-ignore
    const {title, description, count, price} = event.body;

    if(!title || !description || !count || !price) {return formatJSONResponse({
      status: 400,
      message: 'Invalid post data'
    });
  }

    const product = await productService.createProduct({
      id,
      title,
      description,
      count,
      price,
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
