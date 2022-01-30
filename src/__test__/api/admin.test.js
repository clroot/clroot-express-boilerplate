import request from 'supertest';
import httpStatus from 'http-status';
import { closeServer, startServer } from '/index';
import { User, UserRole } from '/models';
import {
  createTestUser,
  getAccessTokenCookies,
  removeTestUser,
  testUserEmail,
  testUserPassword,
} from '/__test__/helper';

describe('admin API 의', () => {
  const apiPrefix = '/api/v1/admin';
  let server;

  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(async () => {
    await closeServer(server);
  });

  describe('/check 는', () => {
    const route = `${apiPrefix}/check`;

    describe('성공시', () => {
      let adminUser;
      let cookies;

      beforeAll(async () => {
        const newUserId = await createTestUser();
        adminUser = await User.findByPk(newUserId);

        adminUser.role = UserRole.ADMIN;
        await adminUser.save();

        cookies = await getAccessTokenCookies(server, {
          email: testUserEmail,
          password: testUserPassword,
        });
      });

      afterAll(async () => {
        await removeTestUser();
      });

      it('객체를 return 한다.', async () => {
        await request(server)
          .get(route)
          .set('Cookie', cookies)
          .expect(httpStatus.OK);
      });
    });
  });
});