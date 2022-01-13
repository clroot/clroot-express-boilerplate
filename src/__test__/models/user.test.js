import { syncAllModel, User } from '../../models';

describe('User Model 은', () => {
  beforeAll(async () => {
    await syncAllModel();
  });

  const testUsername = 'test';
  const testUserEmail = 'test@email.com';
  const testUserPassword = 'test-password';

  it('email, username, password 필드를 가진다', async () => {
    const beforeCount = await User.count();

    let testUser = await User.create({
      username: testUsername,
      email: testUserEmail,
      password: testUserPassword,
    });

    expect(testUser.username).toEqual(testUsername);
    expect(testUser.email).toEqual(testUserEmail);
    expect(testUser.password).toEqual(testUserPassword);
    expect(await User.count()).toBeGreaterThan(beforeCount);
  });
});