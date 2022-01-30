import request from 'supertest';
import httpStatus from 'http-status';
import { randEmail, randPassword, randUserName } from '@ngneat/falso';
import { closeServer, startServer } from '/index';
import { User, UserRole } from '/models';
import { createTestUser, getAccessTokenCookies, removeTestUser } from '/__test__/helper';

describe('admin API 의', () => {
  const apiPrefix = '/api/v1/admin/user';
  let server;
  let adminUser;
  let cookies;

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
    await closeServer(server);
  });

  describe('/user/list 는', () => {
    const route = `${apiPrefix}/list`;

    const dummyCount = 50;
    const dummyUserList = [];

    beforeAll(async () => {
      const promise = Array.from({ length: dummyCount }).map(async () => {
        const email = randEmail();
        dummyUserList.push(email);
        await createTestUser({
          email,
          username: randUserName(),
          password: randPassword(),
        });
      });

      await Promise.all(promise);
    });

    afterAll(async () => {
      const promise = dummyUserList.map(async (email) => {
        await removeTestUser({ email });
      });

      await Promise.all(promise);
    });

    describe('성공시', () => {
      it('list 객체를 return 한다.', async () => {
        const { body, ...rest } = await request(server)
          .get(route)
          .set('Cookie', cookies)
          .expect(httpStatus.OK);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThanOrEqual(dummyCount);
      });
    });
  });
});