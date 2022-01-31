import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { serve as swaggerServe, setup as swaggerSetup } from 'swagger-ui-express';

import api from '/api';
import { customErrorHandler, notFoundErrorHandler } from '/exception';
import { consumeUser } from '/lib/token';
import swaggerSpecs from '/lib/swagger';

const app = express();

app.use(logger(process.env.LOG_LEVEL || 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(consumeUser);
app.use('/api/v1', api);
app.use(customErrorHandler);
if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerServe, swaggerSetup(swaggerSpecs, { explorer: true }));
}
app.get('*', notFoundErrorHandler);

export default app;