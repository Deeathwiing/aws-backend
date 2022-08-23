import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: '/product/{Id}',
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
