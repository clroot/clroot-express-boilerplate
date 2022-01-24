import { Router } from 'express';
import authApi from './auth';
import userApi from './user';

const api = Router();

api.use('/auth', authApi);
api.use('/user', userApi);

export default api;