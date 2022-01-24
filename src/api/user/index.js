import { Router } from 'express';
import * as userCtrl from './user.ctrl';

const userApi = Router();

userApi.post('/register', userCtrl.register);

export default userApi;