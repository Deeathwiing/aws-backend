import { middyfy } from '@libs/lambda';

import {formatJSONResponse} from "@libs/api-gateway";

import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from "aws-lambda";


export const basicAuthorizerHandler  = async (event: APIGatewayTokenAuthorizerEvent) => {
  console.log('Incoming Event', event);
  try {
    const { type, authorizationToken, methodArn } = event;
    if (type !== "TOKEN" || !authorizationToken) {
      return formatJSONResponse({status: 403, message: 'Auth token not provided'});
    }
    const encodedCreds = authorizationToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const [login, password] = buff.toString("utf-8").split(":");

    const storedPass = process.env[login];
    const effect = !storedPass || storedPass !== password ? "Deny" : "Allow";
    console.log("Check auth result", effect);
    return buildPolicy(encodedCreds, methodArn, effect);
  } catch (error) {
    return formatJSONResponse({ status: 500, message: error});
  }
  
};

export const basicAuthorizer = middyfy(basicAuthorizerHandler);


const buildPolicy = (
    principalId: string,
    resource: string,
    effect: "Allow" | "Deny"
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

