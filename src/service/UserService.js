import { User } from '/models';
import { UserDuplicateException } from '/exception';

class UserService {
  /**
   * @param {string} email
   * @throws {UserDuplicateException} given email is already registered
   * */
  static async validateDuplicateUser(email) {
    const isExist = await User.findByEmail(email);
    if (isExist !== null) {
      throw new UserDuplicateException();
    }
  }

  /**
   * User Register Method
   * @async
   * @param {Object} payload
   * @param {string} payload.email
   * @param {string} payload.username
   * @param {string} payload.password
   * @return {Promise<number>} userId
   * */
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