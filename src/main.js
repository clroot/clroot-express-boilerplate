import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import api from './api';

const main = express();

main.use(logger('dev'));
main.use(express.json());
main.use(express.urlencoded({ extended: false }));
main.use(cookieParser());
main.use(express.static(path.join(__dirname, 'public')));

main.use('/', api);

export default main;