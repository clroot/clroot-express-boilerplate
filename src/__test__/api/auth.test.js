import request from 'supertest';
import httpStatus from 'http-status';
import { closeServer, startServer } from '/';
import { ACCESS_TOKEN_COOKIE } from '/lib/constants';
import { Role } from '/models/user';
import { createTestUser, removeTestUser, testUserEmail, testUsername, testUserPassword } from '/__test__/helper';

describe('auth API 의', () => {
  const apiPrefix = '/api/v1/auth';
  let server;

  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(async () => {
    await closeServer(server);
  });

  describe('/login 은', () => {
    const route = `${apiPrefix}/login`;

    beforeAll(async () => {
      await createTestUser();
    });

    afterAll(async () => {
      await removeTestUser();
    });

    describe('성공시', () => {
      it('UserDTO 객체를 return 하고, access-token 을 설정한다.', async () => {
        const payload = {
          email: testUserEmail,
          password: testUserPassword,
        };

        const { body, headers: { 'set-cookie': cookie } } = await request(server)
          .post(route)
          .send(payload)
          .expect(httpStatus.OK);

        const { email, username, role, ...rest } = body;
        const isThereAccessToken = !!cookie.find(iter => iter.includes(`${ACCESS_TOKEN_COOKIE}=`));

        expect(email).toBe(testUserEmail);
        expect(username).toBe(testUsername);
        expect(role).toBe(Role.USER);
        expect(rest).toStrictEqual({});
        expect(isThereAccessToken).toBeTruthy();
      });
    });

    describe('실패: ', () => {
      it('email 과 password 가 전달되지 않으면, BAD_REQUEST 에러코드를 return 한다.', async () => {
        const badPayload = {};

        await request(server)
          .post(route)
          .send(badPayload)
          .expect(httpStatus.BAD_REQUEST);
      });

      it('가입되지 않은 이메일로 로그인을 시도하면, NOT_FOUND 에러코드를 return 한다.', async () => {
        const payload = {
          email: 'not-registered@email.com',
          password: 'some-password',
        };

        await request(server)
          .post(route)
          .send(payload)
          .expect(httpStatus.NOT_FOUND);
      });

      it('잘못된 비밀번호로 로그인을 시도하면, UNAUTHORIZED 에러코드를 return 한다.', async () => {
        const payload = {
          email: testUserEmail,
          password: 'wrong-password',
        };

        await request(server)
          .post(route)
          .send(payload)
          .expect(httpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/logout 은', () => {
    const route = `${apiPrefix}/logout`;

    beforeEach(async () => {
      const loginPayload = {
        email: testUserEmail,
        password: testUserPassword,
      };

      await request(server)
        .post(`${apiPrefix}/login`)
        .send(loginPayload);
    });

    describe('성공시', () => {
      it('access-token 을 삭제한다.', async () => {
        const { body, headers: { 'set-cookie': cookie } } = await request(server)
          .post(route)
          .expect(httpStatus.NO_CONTENT);

        const isAccessTokenRemoved = !!cookie.find(iter => iter.includes(`${ACCESS_TOKEN_COOKIE}=;`));

        expect(body).toStrictEqual({});
        expect(isAccessTokenRemoved).toBeTruthy();
      });
    });
  });
});