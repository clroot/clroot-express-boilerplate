import request from 'supertest';
import httpStatus from 'http-status';
import { closeServer, startServer } from '/index';
import { User, UserRole } from '/models';
import { createTestUser, getAccessTokenCookies, removeTestUser } from '/__test__/helper';
import { randEmail, randPassword, randUserName } from '@ngneat/falso';

describe('admin API 의', () => {
  const apiPrefix = '/api/v1/admin';
  let server;

  const testUserEmail = randEmail();
  const testUsername = randUserName();
  const testUserPassword = randPassword();

  const userPayload = {
    email: testUserEmail,
    username: testUsername,
    password: testUserPassword,
  };

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
        await createTestUser(userPayload);
        adminUser = await User.findByEmail(testUserEmail);

        adminUser.role = UserRole.ADMIN;
        await adminUser.save();

        cookies = await getAccessTokenCookies(server, {
          email: testUserEmail,
          password: testUserPassword,
        });
      });

      afterAll(async () => {
        await removeTestUser(userPayload);
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