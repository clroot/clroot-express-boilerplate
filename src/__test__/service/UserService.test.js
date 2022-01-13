import { syncAllModel, User } from '/models';
import { UserService } from '/service';
import { UserDuplicateError } from '/error';
import bcrypt from 'bcrypt';

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

describe('UserService 의', () => {
  beforeAll(async () => {
    await syncAllModel();
  });

  describe('registerUser 메서드는', () => {
    describe('성공시', () => {
      afterEach(async () => {
        await removeTestUser();
      });

      it('userId를 return 한다.', async () => {
        const userId = await UserService.register(payload);

        expect(typeof userId).toBe('number');
      });

      it('생성된 user 의 password 는 hash 되어있다.', async () => {
        await UserService.register(payload);
        const createdUser = await UserService.findByEmail(testUserEmail);

        expect(createdUser.password).not.toBe(testUserPassword);
        expect(await bcrypt.compare(testUserPassword, createdUser.password)).toBe(true);
      });
    });

    describe('중복유저가 존재하면', () => {
      beforeAll(async () => {
        await UserService.register(payload);
      });

      afterAll(async () => {
        await removeTestUser();
      });

      it('UserDuplicateError 가 Throw 된다.', async () => {
        const shouldThrowError = async () => {
          await UserService.register(payload);
        };

        await expect(shouldThrowError).rejects.toThrowError(UserDuplicateError);
      });
    });
  });

  describe('findByEmail 메서드는', () => {
    beforeAll(async () => {
      await UserService.register(payload);
    });

    afterAll(async () => {
      await removeTestUser();
    });

    describe('성공시', () => {
      it('생성된 유저를 return 한다.', async () => {
        const user = await UserService.findByEmail(testUserEmail);
        expect(user).toBeInstanceOf(User);
      });
    });
  });
});