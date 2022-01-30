import jwt from 'jsonwebtoken';
import { AuthenticationException } from '/exception';
import { ACCESS_TOKEN_COOKIE } from './constants';

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'JWT_SECRET';

export const generateToken = (payload, options = { expiresIn: '7d' }) => {
  const jwtOptions = {
    issuer: '*.clroot.io', expiresIn: '7d', ...options,
  };

  return jwt.sign(payload, jwtSecretKey, jwtOptions);
};

export const decodeToken = (token) => {
  return jwt.verify(token, jwtSecretKey);
};

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
    return next(new AuthenticationException('유효하지 않은 토큰입니다.'));
  }
};