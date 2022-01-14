import bcrypt from 'bcrypt';
import { User } from '/models';
import { UserDuplicateError } from '/error';

class UserService {
  async register({ email, username, password }) {
    await UserService.#validateDuplicateUser(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return newUser.id;
  }

  static async #validateDuplicateUser(email) {
    const isExist = await User.findByEmail(email);
    if (isExist !== null) {
      throw new UserDuplicateError();
    }
  }
}

const instance = new UserService();

export default instance;