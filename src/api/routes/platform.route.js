import controller from '../controllers/platform.controller.js';
import { platformSchema } from '../middlewares/validation.middleware.js';

// module.export = async function (fastify, opts) { equivalent
export default function (fastify, opts, done) {
  fastify.post(
    '/create',
    {
      schema: {
        body: platformSchema.body,
      },
    },
    controller.create
  );
  fastify.get('/list', controller.list);
  fastify.get(
    '/get/:id',
    {
      schema: {
        params: platformSchema.params,
      },
    },
    controller.get
  );
  fastify.put(
    '/update/:id',
    {
      schema: platformSchema,
    },
    controller.update
  );
  fastify.delete(
    '/delete/:id',
    {
      schema: {
        params: platformSchema.params,
      },
    },
    controller.delete
  );
  fastify.get('/generate-qr/:id', controller.generateQr);
  fastify.get('/:slug', controller.page);
  done();
}
