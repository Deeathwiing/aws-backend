import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import productService from "../../services";


export const getProductsListHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Incoming Event', event);
  const mockData = await productService.getProducts();
  return formatJSONResponse(mockData);
};

export const getProductsList = middyfy(getProductsListHandler);
