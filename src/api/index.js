import { Router } from 'express';
import adminApi from './admin';
import authApi from './auth';
import userApi from './user';

const api = Router();

api.use('/admin', adminApi);
api.use('/auth', authApi);
api.use('/user', userApi);

export default api;