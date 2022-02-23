import { User } from '/models';
import { AuthenticationException } from '/exception';
import { ACCESS_TOKEN_COOKIE } from './constants';
import { decodeToken, generateToken } from './token';

/**
 * Parse JWT token and store state to res.locals.auth
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * */
export const consumeUser = async (req, res, next) => {
  const token = req.cookies['access-token'];

  try {
    const decoded = decodeToken(token);

    const { userId, username, exp } = decoded;

    const user = await User.findByPk(userId);

    res.locals.auth = {
      user,
    };

    const now = Math.floor(Date.now() / 1000);

    if (exp - now < 60 && 60 * 24 * 3.5) {
      const newToken = generateToken({
        userId,
        username,
      });

      req.cookies(ACCESS_TOKEN_COOKIE, newToken, {
        httpOnly: true,
      });
    }

    return next();
  } catch (err) {
    if (err instanceof AuthenticationException) {
      res.locals.auth = {};
      return next();
    } else {
      return next(err);
    }
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const isLoggedIn = (req, res, next) => {
  if (!res.locals.auth.user) {
    return next(new AuthenticationException('로그인이 필요합니다.'));
  }
  return next();
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const isNotLoggedIn = (req, res, next) => {
  if (res.locals.auth.user) {
    return next(new AuthenticationException('이미 로그인되어 있습니다.'));
  }
  return next();
};