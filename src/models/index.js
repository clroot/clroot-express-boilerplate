import User from './user';

/**
 * create or alter all models
 * @function
 * */
export const syncAllModel = async () => {
  try {
    await User.sync({ alter: true });
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') return Promise.reject(e);
  }
};

export { default as User, Role as UserRole } from './user';
