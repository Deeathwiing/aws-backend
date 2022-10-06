import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import productService from "../../services";


export const getProductsListHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Incoming Event', event);
  try {
    const products = await productService.getProducts();
    return formatJSONResponse(products);
  } catch (error) {
    console.log('Error', error);
  
    return formatJSONResponse({
      status: 500,
      message: error
    });
  }
  
};

export const getProductsList = middyfy(getProductsListHandler);
