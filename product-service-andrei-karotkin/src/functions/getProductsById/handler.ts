import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import {ProductService} from '../../services/products';

const productService = new ProductService();

export const getProductByIdHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Incoming Event', event);
  try {
    const product = await productService.getProduct(event.pathParameters?.Id);
    return formatJSONResponse(product);
  } catch (error) {
    return formatJSONResponse(error.message);
  }
};

export const getProductById = middyfy(getProductByIdHandler);
