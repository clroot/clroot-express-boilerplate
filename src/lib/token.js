import jwt from 'jsonwebtoken';

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