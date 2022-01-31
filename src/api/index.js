import { Router } from 'express';
import { serve as swaggerServe, setup as swaggerSetup } from 'swagger-ui-express';
import adminApi from './admin';
import authApi from './auth';
import userApi from './user';
import swaggerSpecs from '../lib/swagger';

const api = Router();

api.use('/admin', adminApi);
api.use('/auth', authApi);
api.use('/user', userApi);
api.use('/docs', swaggerServe, swaggerSetup(swaggerSpecs, { explorer: true }));

export default api;