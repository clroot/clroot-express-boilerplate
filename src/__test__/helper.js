import request from 'supertest';
import { syncAllModel, User } from '/models';
import { UserService } from '/service';

export const initDatabase = async () => {
  await syncAllModel();
};

/**
 * @param {import('/dto').UserRegisterFormDTO} userPayload
 * @return {Promise<number>}
 */
export const createTestUser = async (userPayload) => {
  try {
    return await UserService.register(userPayload);
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * @param {Object} userPayload
 * @param {string} userPayload.email
 * @return {Promise<void>}
 */
export const removeTestUser = async (userPayload) => {
  const { email } = userPayload;
  await User.destroy({
    where: {
      email,
    },
  });
};

/**
 * @param {import('http').Server} server
 * @param {import('/dto').UserLoginFormDTO} userPayload
 * @return {Promise<*>}
 */
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