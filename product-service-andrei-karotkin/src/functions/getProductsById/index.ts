import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: '/product/{Id}',
        cors: true,
        request: {
          parameters: {
            paths: {
              Id: true,
            },
          },
        },
      },
    },
  ],
};
