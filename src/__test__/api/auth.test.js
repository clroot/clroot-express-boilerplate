import request from 'supertest';
import httpStatus from 'http-status';
import { closeServer, startServer } from '/';
import { ACCESS_TOKEN_COOKIE } from '/lib/constants';
import {
  createTestUser,
  removeTestUser,
  testUserEmail,
  testUsername,
  testUserPassword,
  testUserPayload,
} from '/__test__/helper';

describe('auth API 의', () => {
  const apiPrefix = '/api/v1/auth';
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

        const { email, username, ...rest } = body;

        expect(email).toBe(testUserEmail);
        expect(username).toBe(testUsername);
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

        const { email, username, ...rest } = body;
        const isThereAccessToken = !!cookie.find(iter => iter.includes(`${ACCESS_TOKEN_COOKIE}=`));

        expect(email).toBe(testUserEmail);
        expect(username).toBe(testUsername);
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
});