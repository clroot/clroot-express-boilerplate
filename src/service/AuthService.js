import { User } from '/models';
import { AuthenticationError, UserNotFound } from '/error';

class AuthService {
  async login({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user)
      throw new UserNotFound();

    const isValid = await user.checkPassword(password);
    if (!isValid)
      throw new AuthenticationError();

    return user;
  }
}

const instance = new AuthService();

export default instance;