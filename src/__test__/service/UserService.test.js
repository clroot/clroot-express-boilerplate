import bcrypt from 'bcrypt';
import { UserService } from '/service';
import { User } from '/models';
import { UserDuplicateError } from '/error';
import {
  createTestUser,
  initDatabase,
  removeTestUser,
  testUserEmail,
  testUserPassword,
  testUserPayload,
} from '/__test__/helper';

describe('UserService 의', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  describe('registerUser 메서드는', () => {
    describe('성공시', () => {
      afterEach(async () => {
        await removeTestUser();
      });

      it('userId를 return 한다.', async () => {
        const userId = await UserService.register(testUserPayload);

        expect(typeof userId).toBe('number');
      });

      it('생성된 user 의 password 는 hash 되어있다.', async () => {
        await UserService.register(testUserPayload);
        const createdUser = await User.findByEmail(testUserEmail);

        expect(createdUser.password).not.toBe(testUserPassword);
        expect(await bcrypt.compare(testUserPassword, createdUser.password)).toBe(true);
      });
    });

    describe('중복유저가 존재하면', () => {
      beforeAll(async () => {
        await createTestUser();
      });

      afterAll(async () => {
        await removeTestUser();
      });

      it('UserDuplicateError 가 Throw 된다.', async () => {
        const shouldThrowError = async () => {
          await UserService.register(testUserPayload);
        };

        await expect(shouldThrowError).rejects.toThrowError(UserDuplicateError);
      });
    });
  });
});