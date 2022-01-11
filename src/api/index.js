import { Router } from 'express';
import userApi from './user';

const api = Router();

/* GET home page. */
api.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

api.use('/user', userApi);

export default api;