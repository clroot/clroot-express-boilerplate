import { Router } from 'express';
import { consumeUser } from '/lib/token';
import * as adminCtrl from './admin.ctrl';

const adminApi = Router();

adminApi.use(consumeUser);
adminApi.use(adminCtrl.checkAdminRole);

adminApi.get('/check', adminCtrl.check);

export default adminApi;