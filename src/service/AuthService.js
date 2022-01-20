import { User } from '/models';
import { AuthenticationException, UserNotFoundException } from '/exception';

class AuthService {
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