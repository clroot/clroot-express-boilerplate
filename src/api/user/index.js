import { Router } from 'express';

const userApi = Router();

/* GET users listing. */
userApi.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

export default userApi;
