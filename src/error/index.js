import httpStatus from 'http-status';
import AuthenticationError from './AuthenticationError';
import IllegalStateError from './IllegalStateError';
import InvalidArgumentsError from './InvalidArgumentsError';
import UserNotFound from './UserNotFound';
import UserDuplicateError from './UserDuplicateError';

export { default as AuthenticationError } from './AuthenticationError';
export { default as IllegalStateError } from './IllegalStateError';
export { default as InvalidArgumentsError } from './InvalidArgumentsError';
export { default as UserDuplicateError } from './UserDuplicateError';
export { default as UserNotFound } from './UserNotFound';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof InvalidArgumentsError) {
    res.status(httpStatus.BAD_REQUEST);
  } else if (err instanceof AuthenticationError) {
    res.status(httpStatus.UNAUTHORIZED);
  } else if (err instanceof UserNotFound) {
    res.status(httpStatus.NOT_FOUND);
  } else if (err instanceof UserDuplicateError) {
    res.status(httpStatus.CONFLICT);
  } else if (err instanceof IllegalStateError) {
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