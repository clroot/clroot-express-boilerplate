import httpStatus from 'http-status';
import AuthenticationException from './AuthenticationException';
import IllegalStateException from './IllegalStateException';
import InvalidArgumentsException from './InvalidArgumentsException';
import UserNotFoundException from './UserNotFoundException';
import UserDuplicateException from './UserDuplicateException';

export { default as AuthenticationException } from './AuthenticationException';
export { default as IllegalStateException } from './IllegalStateException';
export { default as InvalidArgumentsException } from './InvalidArgumentsException';
export { default as UserDuplicateException } from './UserDuplicateException';
export { default as UserNotFoundException } from './UserNotFoundException';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof InvalidArgumentsException) {
    res.status(httpStatus.BAD_REQUEST);
  } else if (err instanceof AuthenticationException) {
    res.status(httpStatus.UNAUTHORIZED);
  } else if (err instanceof UserNotFoundException) {
    res.status(httpStatus.NOT_FOUND);
  } else if (err instanceof UserDuplicateException) {
    res.status(httpStatus.CONFLICT);
  } else if (err instanceof IllegalStateException) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    err.message = '서버 내부 오류가 발생했습니다.';
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }

  return res.json({
    'error': err.name,
    'message': err.message,
  });
};