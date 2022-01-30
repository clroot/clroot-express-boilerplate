import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import api from '/api';
import { errorHandler } from '/exception';
import { consumeUser } from '/lib/token';

const app = express();

app.use(logger(process.env.LOG_LEVEL || 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(consumeUser);
app.use('/api/v1', api);
app.use(errorHandler);

export default app;