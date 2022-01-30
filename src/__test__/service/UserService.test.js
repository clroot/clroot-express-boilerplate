import { randEmail, randPassword, randUserName } from '@ngneat/falso';
import { UserService } from '/service';
import { User } from '/models';
import { UserDuplicateException } from '/exception';
import { createTestUser, initDatabase, removeTestUser } from '/__test__/helper';

describe('UserService 의', () => {

  const testUserEmail = randEmail();
  const testUsername = randUserName();
  const testUserPassword = randPassword();

  const userPayload = {
    email: testUserEmail,
    username: testUsername,
    password: testUserPassword,
  };

  beforeAll(async () => {
    await initDatabase();
  });

  describe('registerUser 메서드는', () => {
    describe('성공시', () => {
      afterEach(async () => {
        await removeTestUser(userPayload);
      });

      it('userId를 return 한다.', async () => {
        const userId = await UserService.register(userPayload);

        expect(typeof userId).toBe('number');
      });

      it('생성된 user 의 password 는 hash 되어있다.', async () => {
        await UserService.register(userPayload);
        const createdUser = await User.findByEmail(testUserEmail);

        expect(createdUser.password).not.toBe(testUserPassword);
      });
    });

    describe('중복유저가 존재하면', () => {
      beforeAll(async () => {
        await createTestUser(userPayload);
      });

      afterAll(async () => {
        await removeTestUser(userPayload);
      });

      it('UserDuplicateException 가 Throw 된다.', async () => {
        const shouldThrowError = async () => {
          await UserService.register({
            ...userPayload,
            username: randUserName(),
            password: randPassword(),
          });
        };

        await expect(shouldThrowError).rejects.toThrowError(UserDuplicateException);
      });
    });
  });
});