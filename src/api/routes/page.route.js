import platformController from '../controllers/platform.controller';
import transactionController from '../controllers/transaction.controller';
import page from '../controllers/page.controller';

// module.export = async function (fastify, opts) { equivalent
export default function (fastify, opts, done) {
  fastify.get('/payment', page.payment);
  fastify.get('/platform/detail', platformController.detail_page);
  done();
}
