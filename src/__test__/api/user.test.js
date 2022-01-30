import request from 'supertest';
import httpStatus from 'http-status';
import { randEmail, randPassword, randUserName } from '@ngneat/falso';
import { closeServer, startServer } from '/index';
import { UserRole } from '/models';
import { createTestUser, removeTestUser } from '/__test__/helper';

describe('user API 의', () => {
  const apiPrefix = '/api/v1/user';
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

  describe('/register 는', () => {
    const route = `${apiPrefix}/register`;

    describe('성공시', () => {
      afterAll(async () => {
        await removeTestUser(userPayload);
      });

      it('UserDTO 객체를 return 한다.', async () => {
        const payload = {
          ...userPayload,
        };

        const { body } = await request(server)
          .post(route)
          .send(payload)
          .expect(httpStatus.CREATED);

        const { email, username, role, ...rest } = body;

        expect(email).toBe(testUserEmail);
        expect(username).toBe(testUsername);
        expect(role).toBe(UserRole.USER);
        expect(rest).toStrictEqual({});
      });
    });

    describe('중복된 이메일이 존재하면', () => {
      beforeAll(async () => {
        await createTestUser(userPayload);
      });

      afterAll(async () => {
        await removeTestUser(userPayload);
      });

      it('CONFLICT 를 return 한다.', async () => {
        const payload = {
          ...userPayload,
          username: randUserName(),
          password: randPassword(),
        };

        const { body } = await request(server)
          .post(route)
          .send(payload)
          .expect(httpStatus.CONFLICT);

        console.log(body);
      });
    });

    describe('email, username, password 가 제공되지 않으면', () => {
      it('BAD_REQUEST 오류가 발생한다.', async () => {
        const payload = {
          ...userPayload,
        };
        delete payload.username;

        await request(server)
          .post(route)
          .send(payload)
          .expect(httpStatus.BAD_REQUEST);
      });
    });
  });
});