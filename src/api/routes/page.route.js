import platformController from '../controllers/platform.controller.js';
import page from '../controllers/page.controller.js';

// module.export = async function (fastify, opts) { equivalent
export default function (fastify, opts, done) {
  fastify.get('/payment', page.payment);
  fastify.get('/platform/detail', platformController.detail_page);
  done();
}
