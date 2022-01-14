import { Router } from 'express';
import httpStatus from 'http-status';
import { User } from '/models';
import { AuthService, UserService } from '/service';
import { AuthenticationError, UserDuplicateError, UserNotFound } from '/error';
import { generateToken } from '../../lib/token';

const authApi = Router();

authApi.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    await UserService.register({ email, username, password });
    const createdUser = await User.findByEmail(email);

    res.status(httpStatus.CREATED);

    return res.json(createdUser);
  } catch (err) {
    if (err instanceof UserDuplicateError) {
      res.status(httpStatus.CONFLICT);

      return res.json({
        'error': err.message,
      });
    } else {
      throw err;
    }
  }
});

authApi.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(httpStatus.BAD_REQUEST);
    return res.json({});
  }

  try {
    const user = await AuthService.login({ email, password });

    const { id: userId, username } = user;
    const token = generateToken({
      userId,
      username,
    });

    res.cookie('access-token', token, {
      httpOnly: true,
    });

    return res.json(user);
  } catch (err) {
    if (err instanceof UserNotFound) {
      res.status(httpStatus.NOT_FOUND);
    } else if (err instanceof AuthenticationError) {
      res.status(httpStatus.UNAUTHORIZED);
    } else {
      throw err;
    }
  }
  return res.json({});
});

authApi.post('/logout', (req, res, next) => {
  next();
});

authApi.get('/check', (req, res, next) => {
  next();
});

export default authApi;