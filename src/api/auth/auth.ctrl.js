import httpStatus from 'http-status';
import { AuthService } from '/service';
import { UserDTO, UserLoginFormDTO } from '/dto';
import { generateToken } from '/lib/token';
import { ACCESS_TOKEN_COOKIE } from '/lib/constants';

/**
 * 유저 Login API
 * httpOnly 쿠키로 access-token 생성
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

/**
 * 유저 Logout API
 * access-token 쿠키 삭제
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const logout = (req, res, next) => {
  try {
    res.cookie(ACCESS_TOKEN_COOKIE, '');
    res.status(httpStatus.NO_CONTENT);
    return res.send({});
  } catch (err) {
    return next(err);
  }
};

/**
 * 로그인 확인 API
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const check = (req, res, next) => {
  try {
    return res.send({ 'check': true });
  } catch (err) {
    return next(err);
  }
};