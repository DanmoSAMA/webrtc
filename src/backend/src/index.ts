import * as Koa from 'koa';
import * as KoaBody from 'koa-bodyparser';
import * as Cors from '@koa/cors';
import * as Logger from 'koa-logger';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { setupMongo } from './models';
import handleError from './middleware/handleError';
import router from './router/index';
import setupSocket from './socket';

setupMongo();

const app = new Koa();

// let certOptions = null;

// try {
//   certOptions = {
//     key: fs.readFileSync(path.resolve('src/certs/server.key')),
//     cert: fs.readFileSync(path.resolve('src/certs/server.crt')),
//   };
// } catch (err) {
//   console.log('No certificate files found!');
// }

app
  .use(Logger())
  .use(
    Cors({
      origin: '*',
      allowMethods: '*',
      allowHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      exposeHeaders:
        'Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type',
      credentials: true,
    }),
  )
  .use(handleError())
  .use(KoaBody())
  .use(router.routes())
  .use(router.allowedMethods());

// const httpServer = https.createServer(certOptions, app.callback());

const httpServer = http.createServer(app.callback());

httpServer.listen(8080, () => {
  console.log('Server is running at 127.0.0.1:8080');
});

setupSocket(httpServer);
