import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import productService from "../../services";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";


export const getProductByIdHandler= async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Incoming Event', event);
  try {
    const id = event.pathParameters.Id;
    console.log('Id', id);
    const product = await productService.getProduct(id);
    return formatJSONResponse({
      product
    });
  } catch (error) {
    console.log('Error', error);
  
    return formatJSONResponse({
      status: 500,
      message: error
    });
  }
};

export const getProductById = middyfy(getProductByIdHandler);
