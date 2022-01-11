import { Router } from 'express';
import authApi from './auth';

const api = Router();

api.use('/auth', authApi);

export default api;