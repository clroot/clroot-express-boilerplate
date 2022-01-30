import { Router } from 'express';
import { consumeUser } from '/lib/token';
import { User, UserRole } from '/models';
import { AuthenticationException } from '/exception';
import adminUserApi from './user';

const checkAdminRole = async (req, res, next) => {
  const { auth: { userId } } = res.locals;

  try {
    const user = await User.findByPk(userId);
    const { role } = user;

    if (role !== UserRole.ADMIN) {
      return next(new AuthenticationException('접근할 권한이 없습니다.'));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};


const adminApi = Router();

adminApi.use(consumeUser);
adminApi.use(checkAdminRole);

adminApi.use('/user', adminUserApi);

export default adminApi;