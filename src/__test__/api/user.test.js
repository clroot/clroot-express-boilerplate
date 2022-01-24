import request from 'supertest';
import httpStatus from 'http-status';
import { closeServer, startServer } from '/index';
import { Role } from '/models/user';
import { createTestUser, removeTestUser, testUserEmail, testUsername, testUserPayload } from '/__test__/helper';

describe('user API 의', () => {
  const apiPrefix = '/api/v1/user';
  let server;

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
        await removeTestUser();
      });

      it('UserDTO 객체를 return 한다.', async () => {
        const { body } = await request(server)
          .post(route)
          .send(testUserPayload)
          .expect(httpStatus.CREATED);

        const { email, username, role, ...rest } = body;

        expect(email).toBe(testUserEmail);
        expect(username).toBe(testUsername);
        expect(role).toBe(Role.USER);
        expect(rest).toStrictEqual({});
      });
    });

    describe('중복된 이메일이 존재하면', () => {
      beforeAll(async () => {
        await createTestUser();
      });

      afterAll(async () => {
        await removeTestUser();
      });

      it('CONFLICT 를 return 한다.', async () => {
        const { body } = await request(server)
          .post(route)
          .send(testUserPayload)
          .expect(httpStatus.CONFLICT);

        console.log(body);
      });
    });

    describe('email, username, password 가 제공되지 않으면', () => {
      it('BAD_REQUEST 오류가 발생한다.', async () => {
        await request(server)
          .post(route)
          .send({})
          .expect(httpStatus.BAD_REQUEST);
      });
    });
  });
});