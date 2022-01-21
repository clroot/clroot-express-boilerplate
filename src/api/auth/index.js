import { Router } from 'express';
import httpStatus from 'http-status';
import { User } from '/models';
import { AuthService, UserService } from '/service';
import { UserDTO, UserLoginFormDTO, UserRegisterForm } from '/dto';
import { generateToken } from '/lib/token';
import { ACCESS_TOKEN_COOKIE } from '/lib/constants';

const authApi = Router();

authApi.post('/register', async (req, res, next) => {
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
});

authApi.post('/login', async (req, res, next) => {
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
});

authApi.post('/logout', (req, res, next) => {
  next();
});

authApi.get('/check', (req, res, next) => {
  next();
});

export default authApi;