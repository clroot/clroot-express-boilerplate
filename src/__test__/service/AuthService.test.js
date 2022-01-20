import { AuthService } from '/service';
import { AuthenticationException, UserNotFoundException } from '/exception';
import { createTestUser, initDatabase, removeTestUser, testUserEmail, testUserPassword } from '/__test__/helper';

const payload = {
  email: testUserEmail,
  password: testUserPassword,
};

describe('AuthService 의', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  describe('login 메서드는', () => {
    describe('성공시', () => {
      beforeAll(async () => {
        await createTestUser();
      });

      afterAll(async () => {
        await removeTestUser();
      });

      it('user 객체를 return 한다', async () => {
        await AuthService.login(payload);
      });
    });

    describe('가입되지 않은 이메일로 로그인하면', () => {
      it('UserNotFoundException 를 throw 한다', async () => {
        const shouldThrowError = async () => {
          await AuthService.login(payload);
        };

        await expect(shouldThrowError).rejects.toThrowError(UserNotFoundException);
      });
    });

    describe('잘못된 비밀번호로 로그인하면', () => {
      beforeAll(async () => {
        await createTestUser();
      });

      afterAll(async () => {
        await removeTestUser();
      });

      it('AuthenticationException 를 throw 한다', async () => {
        const shouldThrowError = async () => {
          await AuthService.login({
            ...payload,
            password: 'wrong-password',
          });
        };

        await expect(shouldThrowError).rejects.toThrowError(AuthenticationException);
      });
    });
  });
});