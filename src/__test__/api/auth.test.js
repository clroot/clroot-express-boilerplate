import request from 'supertest';
import httpStatus from 'http-status';
import { closeServer, startServer } from '/';
import { User } from '/models';
import { UserService } from '/service';

const testUserEmail = 'test@email.com';
const testUsername = 'test';
const testUserPassword = 'test-password';

const payload = {
  email: testUserEmail,
  username: testUsername,
  password: testUserPassword,
};

const removeTestUser = async () => {
  await User.destroy({
    where: {
      email: testUserEmail,
    },
  });
};

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

      it('user 객체를 return 한다.', async () => {
        const { body } = await request(server)
          .post(route)
          .send(payload)
          .expect(httpStatus.CREATED);

        expect(body.email).toBe(testUserEmail);
        expect(body.username).toBe(testUsername);
      });
    });

    describe('중복된 이메일이 존재하면', () => {
      beforeAll(async () => {
        await UserService.register(payload);
      });

      it('CONFLICT 를 return 한다.', async () => {
        const { body } = await request(server)
          .post(route)
          .send(payload)
          .expect(httpStatus.CONFLICT);

        console.log(body);
      });
    });
  });
});