import { randEmail, randPassword, randUserName } from '@ngneat/falso';
import { AuthService } from '/service';
import { AuthenticationException, UserNotFoundException } from '/exception';
import { createTestUser, initDatabase, removeTestUser } from '/__test__/helper';

describe('AuthService 의', () => {

  const testUserEmail = randEmail();
  const testUsername = randUserName();
  const testUserPassword = randEmail();

  const userPayload = {
    email: testUserEmail,
    username: testUsername,
    password: testUserPassword,
  };

  beforeAll(async () => {
    await initDatabase();
  });

  describe('login 메서드는', () => {
    describe('성공시', () => {
      beforeAll(async () => {
        await createTestUser(userPayload);
      });

      afterAll(async () => {
        await removeTestUser(userPayload);
      });

      it('user 객체를 return 한다', async () => {
        const payload = {
          ...userPayload,
        };
        delete payload.username;

        await AuthService.login(payload);
      });
    });

    describe('가입되지 않은 이메일로 로그인하면', () => {
      it('UserNotFoundException 를 throw 한다', async () => {
        const shouldThrowError = async () => {
          const payload = {
            ...userPayload,
          };
          delete payload.username;

          await AuthService.login(payload);
        };

        await expect(shouldThrowError).rejects.toThrowError(UserNotFoundException);
      });
    });

    describe('잘못된 비밀번호로 로그인하면', () => {
      beforeAll(async () => {
        await createTestUser(userPayload);
      });

      afterAll(async () => {
        await removeTestUser(userPayload);
      });

      it('AuthenticationException 를 throw 한다', async () => {
        const shouldThrowError = async () => {
          const payload = {
            ...userPayload,
            password: randPassword(),
          };
          delete payload.username;

          await AuthService.login(payload);
        };

        await expect(shouldThrowError).rejects.toThrowError(AuthenticationException);
      });
    });
  });
});