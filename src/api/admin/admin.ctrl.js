import { User, UserRole } from '/models';
import { AuthenticationException } from '/exception';

export const checkAdminRole = async (req, res, next) => {
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

export const check = (req, res, next) => {
  try {
    return res.send({ 'check': true });
  } catch (err) {
    return next(err);
  }
};