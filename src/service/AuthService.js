import bcrypt from 'bcrypt';
import { User } from '/models';
import { AuthenticationError, UserNotFound } from '/error';

class AuthService {
  async login({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user)
      throw new UserNotFound();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      throw new AuthenticationError();

    //TODO: JWT 토큰 발급
    return user;
  }
}

const instance = new AuthService();

export default instance;