import { Router } from 'express';
import { isLoggedIn, isNotLoggedIn } from '/lib/middleware';
import * as authCtrl from './auth.ctrl';

const authApi = Router();

authApi.post('/login', isNotLoggedIn, authCtrl.login);
authApi.post('/logout', isLoggedIn, authCtrl.logout);
authApi.get('/check', isLoggedIn, authCtrl.check);

export default authApi;