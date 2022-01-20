import { User } from '/models';
import { UserDuplicateException } from '/exception';

class UserService {
  static async validateDuplicateUser(email) {
    const isExist = await User.findByEmail(email);
    if (isExist !== null) {
      throw new UserDuplicateException();
    }
  }

  async register({ email, username, password }) {
    await UserService.validateDuplicateUser(email);

    const newUser = await User.create({
      email,
      username,
    });
    await newUser.setPassword(password);

    return newUser.id;
  }
}

const instance = new UserService();

export default instance;