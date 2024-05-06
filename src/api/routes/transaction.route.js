import controller from '../controllers/transaction.controller.js';
import {
  transactionCallbackSchema,
  transactionSchema,
} from '../middlewares/validation.middleware.js';

export default function (fastify, opts, done) {
  fastify.post(
    '/create',
    {
      schema: {
        body: transactionSchema.body,
      },
    },
    controller.create
  );
  fastify.get('/list', controller.list);
  fastify.get('/get/:id', controller.get);
  fastify.get('/platform/:id/:status', controller.platform);
  fastify.post(
    '/xcallback',
    {
      schema: {
        body: transactionCallbackSchema.body,
      },
    },
    controller.callback
  );
  done();
}
