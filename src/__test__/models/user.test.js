import { User } from '/models';
import { initDatabase, testUserEmail, testUsername, testUserPassword, testUserPayload } from '/__test__/helper';

describe('User Model 은', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  afterAll(async () => {
    await User.destroy({
      where: {
        email: testUserEmail,
      },
    });
  });

  it('email, username, password 필드를 가진다', async () => {
    const beforeCount = await User.count();

    let testUser = await User.create(testUserPayload);

    expect(testUser.username).toEqual(testUsername);
    expect(testUser.email).toEqual(testUserEmail);
    expect(testUser.password).toEqual(testUserPassword);
    expect(await User.count()).toBeGreaterThan(beforeCount);
  });
});