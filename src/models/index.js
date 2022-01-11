import UserModel from './user';

export const User = UserModel;

export const syncAllModel = async () => {
  await User.sync({ force: true });
};