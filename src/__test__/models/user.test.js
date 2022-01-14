import { User } from '/models';
import {
  createTestUser,
  initDatabase,
  testUserEmail,
  testUsername,
  testUserPassword,
  testUserPayload,
} from '/__test__/helper';

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

    let testUser = await User.create(testUserPayload);

    expect(testUser.username).toBe(testUsername);
    expect(testUser.email).toBe(testUserEmail);
    expect(testUser.password).toBe(testUserPassword);
    expect(await User.count()).toBeGreaterThan(beforeCount);
  });

  it('findByPk 메서드 테스트', async () => {
    const userId = await createTestUser();

    const user = await User.findByPk(userId);

    expect(user.username).toBe(testUsername);
  });
});