import request from 'supertest';
import { syncAllModel, User } from '/models';
import { UserService } from '/service';

export const initDatabase = async () => {
  await syncAllModel();
};

export const createTestUser = async (userPayload) => {
  try {
    return await UserService.register(userPayload);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const removeTestUser = async (userPayload) => {
  const { email } = userPayload;
  await User.destroy({
    where: {
      email,
    },
  });
};

export const getAccessTokenCookies = async (server, userPayload) => {
  const { email, password } = userPayload;
  const { headers } = await request(server)
    .post('/api/v1/auth/login')
    .send({
      email,
      password,
    });
  return headers['set-cookie'];
};