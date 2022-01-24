import { Router } from 'express';
import * as authCtrl from './auth.ctrl';

const authApi = Router();

authApi.post('/login', authCtrl.login);
authApi.post('/logout', authCtrl.logout);
authApi.get('/check', authCtrl.check);

export default authApi;