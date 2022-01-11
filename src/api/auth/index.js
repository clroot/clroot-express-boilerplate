import { Router } from 'express';

const authApi = Router();

authApi.post('/register', (req, res, next) => {
  next();
});
authApi.post('/login', (req, res, next) => {
  next();
});
authApi.post('/logout', (req, res, next) => {
  next();
});
authApi.get('/check', (req, res, next) => {
  next();
});

export default authApi;