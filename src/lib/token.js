import jwt from 'jsonwebtoken';
import { AuthenticationException } from '/exception';
import { ACCESS_TOKEN_COOKIE } from './constants';

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'JWT_SECRET';

/**
 * JWT 토큰 생성
 * @param {Object} payload
 * @param {{expiresIn}} options
 * @return {string} jwt token
 */
export const generateToken = (payload, options = { expiresIn: '7d' }) => {
  const jwtOptions = {
    issuer: '*.clroot.io', expiresIn: '7d', ...options,
  };

  return jwt.sign(payload, jwtSecretKey, jwtOptions);
};

/**
 * JWT Token 검증
 * @param {string} token - access-token string
 * @throws {AuthenticationException} - JWT 토큰 검증 실패시 예외 발생
 */
export const decodeToken = (token) => {
  try {
    return jwt.verify(token, jwtSecretKey);
  } catch (err) {
    throw new AuthenticationException('유효하지 않은 토큰입니다.');
  }
};

/**
 * Parse JWT token and store state to res.locals.auth
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * */
export const consumeUser = (req, res, next) => {
  const token = req.cookies['access-token'];

  try {
    const decoded = decodeToken(token);

    const { userId, username, exp } = decoded;

    res.locals.auth = {
      userId,
      username,
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