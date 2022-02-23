import { Router } from 'express';
import { isNotLoggedIn } from '/lib/middleware';
import * as userCtrl from './user.ctrl';

const userApi = Router();

userApi.post('/register', isNotLoggedIn, userCtrl.register);

export default userApi;