import UserModel from './user';

export const User = UserModel;

export const syncAllModel = async () => {
  try {
    await User.sync({ alter: true });
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') return Promise.reject(e);
  }
};