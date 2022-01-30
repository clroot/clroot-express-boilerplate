import { User } from '/models';
import { AuthenticationException, UserNotFoundException } from '/exception';

class AuthService {
  /**
   * Login Method
   * @param {Object} payload
   * @param {string} payload.email
   * @param {string} payload.password
   * @return {Promise<User>} user
   * @throws {AuthenticationException} wrong password given
   * @throws {UserNotFoundException} given user is not registered
   * */
  async login({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user)
      throw new UserNotFoundException();

    const isValid = await user.checkPassword(password);
    if (!isValid)
      throw new AuthenticationException();

    return user;
  }
}

const instance = new AuthService();

export default instance;