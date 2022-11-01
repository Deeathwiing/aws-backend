import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import importService from "../../services";

const importProductsFileHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Incoming Event', event);
  try {
    const signedUrl = importService.createSignedUrl(event.queryStringParameters.name);
      if (!signedUrl) return formatJSONResponse(
          {
              response: `Error: signedUrl is not created`,
              statusCode: 500
          }
      )
    return formatJSONResponse({
      response: signedUrl,
      statusCode: 200
    });
  } catch (e) {
    console.log('Error',e)
    return formatJSONResponse(
        {
          response: `Error: ${e}`,
          statusCode: 500
        }
    )
  }
};

export const importProductsFile = middyfy(importProductsFileHandler);
