import jwt from 'jsonwebtoken';
import { AuthenticationException } from '/exception';

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