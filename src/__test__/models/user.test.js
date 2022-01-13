import { syncAllModel, User } from '/models';

const testUserEmail = 'test@email.com';
const testUsername = 'test';
const testUserPassword = 'test-password';

const payload = {
  email: testUserEmail,
  username: testUsername,
  password: testUserPassword,
};

describe('User Model 은', () => {
  beforeAll(async () => {
    await syncAllModel();
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

    let testUser = await User.create(payload);

    expect(testUser.username).toEqual(testUsername);
    expect(testUser.email).toEqual(testUserEmail);
    expect(testUser.password).toEqual(testUserPassword);
    expect(await User.count()).toBeGreaterThan(beforeCount);
  });
});