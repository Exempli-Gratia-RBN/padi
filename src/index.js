import 'dotenv/config';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Fastify from 'fastify';
import ejs from 'ejs';

import GLOBAL from './variables';
import { connect } from './api/configs/database';
import './api/services/net.service';

await connect();

const __dirname = dirname(fileURLToPath(import.meta.url));
const envToLogger = {
  development: true,
  production: {
    file: path.join(__dirname, '../logs', 'app.log'),
    timestamp: true,
  },
  test: false,
};

const fastify = Fastify({
  logger: envToLogger[process.env.ENV] ?? true,
});

fastify.register(import('@fastify/view'), {
  engine: {
    ejs,
  },
  root: path.join(__dirname, 'views'),
});

fastify.register(import('@fastify/static'), {
  root: path.join(__dirname, '../public'),
});

fastify.get('/', (req, res) => {
  res.redirect('/platform/detail?id=argasari');
});

// Register all routes
for (const route of GLOBAL.ROUTES) {
  fastify.register(import(`./api/routes/${route}.route`), {
    prefix: route === 'page' ? '/' : `/api/${route}`,
  });
}

fastify.listen({ port: process.env.PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
