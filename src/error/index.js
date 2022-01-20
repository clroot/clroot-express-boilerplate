import httpStatus from 'http-status';
import AuthenticationError from './AuthenticationError';
import InvalidArgumentsError from './InvalidArgumentsError';
import UserNotFound from './UserNotFound';
import UserDuplicateError from './UserDuplicateError';

export { default as AuthenticationError } from './AuthenticationError';
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
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }

  return res.json({
    'error': err.name,
    'message': err.message,
  });
};