import { Router } from 'express';
import { User, UserRole } from '/models';
import { AuthenticationException } from '/exception';
import adminUserApi from './user';

/**
 * 관리자 권한 확인
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {AuthenticationException} - 관리자 권한이 없을 경우, 예외 발생
 */
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

adminApi.use(checkAdminRole);

adminApi.use('/user', adminUserApi);

export default adminApi;