import { Router } from 'express';
import httpStatus from 'http-status';
import { UserService } from '/service';
import { UserDuplicateError } from '/error';

const authApi = Router();

authApi.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    await UserService.register({ email, username, password });
    const createdUser = await UserService.findByEmail(email);

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
authApi.post('/login', (req, res, next) => {
  next();
});
authApi.post('/logout', (req, res, next) => {
  next();
});
authApi.get('/check', (req, res, next) => {
  next();
});

export default authApi;