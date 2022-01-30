import { randEmail, randPassword, randUserName } from '@ngneat/falso';
import { User } from '/models';
import { createTestUser, initDatabase, removeTestUser } from '/__test__/helper';
import bcrypt from 'bcrypt';

describe('User Model 은', () => {

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

  afterEach(async () => {
    await removeTestUser(userPayload);
  });

  it('email, username, password 필드를 가진다', async () => {
    const beforeCount = await User.count();

    let user = await User.create(userPayload);
    await user.setPassword(testUserPassword);

    expect(user.username).toBe(testUsername);
    expect(user.email).toBe(testUserEmail);
    expect(await bcrypt.compare(testUserPassword, user.password)).toBeTruthy();
    expect(await User.count()).toBeGreaterThan(beforeCount);
  });

  it('findByPk 메서드 테스트', async () => {
    const userId = await createTestUser(userPayload);

    const user = await User.findByPk(userId);

    expect(user.username).toBe(testUsername);
  });

  it('findByEmail 메서드 테스트', async () => {
    await createTestUser(userPayload);

    const user = await User.findByEmail(testUserEmail);

    expect(user.username).toBe(testUsername);
  });
});