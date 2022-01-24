import { syncAllModel, User } from '/models';
import { UserService } from '/service';

export const initDatabase = async () => {
  await syncAllModel();
};

export const testUserEmail = 'test@email.com';
export const testUsername = 'test';
export const testUserPassword = 'test-password';

export const testUserPayload = {
  email: testUserEmail,
  username: testUsername,
  password: testUserPassword,
};

export const createTestUser = async (payload = testUserPayload) => {
  try {
    return await UserService.register(payload);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const removeTestUser = async (payload = testUserPayload) => {
  const { email } = payload;
  await User.destroy({
    where: {
      email,
    },
  });
};