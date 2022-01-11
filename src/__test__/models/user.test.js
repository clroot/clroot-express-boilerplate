import { syncAllModel, User } from '../../models';

describe('User Model 은', () => {
  beforeAll(async () => {
    await syncAllModel();
  });

  const testUsername = 'test';
  const testUserEmail = 'test@email.com';
  const testUserPassword = 'test-password';

  it('email, username, password 필드를 가진다', async () => {
    let testUser = await User.create({
      name: testUsername,
      email: testUserEmail,
      password: testUserPassword,
    });

    expect(testUser.name).toEqual(testUsername);
    expect(testUser.email).toEqual(testUserEmail);
    expect(testUser.password).toEqual(testUserPassword);
  });
});