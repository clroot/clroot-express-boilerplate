import { Router } from 'express';
import * as adminUserCtrl from './admin.user.ctrl';

const adminUserApi = Router();

adminUserApi.get('/list', adminUserCtrl.list);

export default adminUserApi;