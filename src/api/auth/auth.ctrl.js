import httpStatus from 'http-status';
import { User } from '/models';
import { AuthService, UserService } from '/service';
import { UserDTO, UserLoginFormDTO, UserRegisterForm } from '/dto';
import { generateToken } from '/lib/token';
import { ACCESS_TOKEN_COOKIE } from '/lib/constants';

export const register = async (req, res, next) => {
  let registerFormDTO;
  try {
    registerFormDTO = new UserRegisterForm(req.body);
  } catch (error) {
    return next(error);
  }

  const { email, username, password } = registerFormDTO;

  try {
    await UserService.register({ email, username, password });
    const createdUser = await User.findByEmail(email);

    res.status(httpStatus.CREATED);

    return res.json(new UserDTO(createdUser));
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  let userLoginFormDTO;
  try {
    userLoginFormDTO = new UserLoginFormDTO(req.body);
  } catch (error) {
    return next(error);
  }

  const { email, password } = userLoginFormDTO;

  try {
    const user = await AuthService.login({ email, password });

    const { id: userId, username } = user;
    const token = generateToken({
      userId,
      username,
    });

    res.cookie(ACCESS_TOKEN_COOKIE, token, {
      httpOnly: true,
    });

    return res.json(new UserDTO(user));
  } catch (err) {
    return next(err);
  }
};

export const logout = (req, res, next) => {
  try {
    res.cookie(ACCESS_TOKEN_COOKIE, '');
    res.status(httpStatus.NO_CONTENT);
    return res.send({});
  } catch (err) {
    return next(err);
  }
};

export const check = (req, res, next) => {
  try {
    return res.send({ 'check': true });
  } catch (err) {
    return next(err);
  }
};