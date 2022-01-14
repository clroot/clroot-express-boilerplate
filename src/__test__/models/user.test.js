import { User } from '/models';
import {
  createTestUser,
  initDatabase,
  testUserEmail,
  testUsername,
  testUserPassword,
  testUserPayload,
} from '/__test__/helper';
import bcrypt from 'bcrypt';

describe('User Model 은', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  afterEach(async () => {
    await User.destroy({
      where: {
        email: testUserEmail,
      },
    });
  });

  it('email, username, password 필드를 가진다', async () => {
    const beforeCount = await User.count();

    let user = await User.create(testUserPayload);
    await user.setPassword(testUserPassword);

    expect(user.username).toBe(testUsername);
    expect(user.email).toBe(testUserEmail);
    expect(await bcrypt.compare(testUserPassword, user.password)).toBeTruthy();
    expect(await User.count()).toBeGreaterThan(beforeCount);
  });

  it('findByPk 메서드 테스트', async () => {
    const userId = await createTestUser();

    const user = await User.findByPk(userId);

    expect(user.username).toBe(testUsername);
  });

  it('findByEmail 메서드 테스트', async () => {
    await createTestUser();

    const user = await User.findByEmail(testUserEmail);

    expect(user.username).toBe(testUsername);
  });
});