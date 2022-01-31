import httpStatus from 'http-status';
import { AuthService } from '/service';
import { UserDTO, UserLoginFormDTO } from '/dto';
import { generateToken } from '/lib/token';
import { ACCESS_TOKEN_COOKIE } from '/lib/constants';

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login
 *    description: 로그인 성공시 httpOnly 쿠키로 access-token 생성
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserLoginFormDTO'
 *    responses:
 *      400:
 *        description: 로그인 정보 누락
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorDTO'
 *      200:
 *        description: 로그인 성공
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserDTO'
 *      401:
 *        description: 로그인 실패(비밀번호 오류)
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorDTO'
 *      404:
 *        description: 가입되지 않은 이메일 로그인 시도
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorDTO'
 *
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
 * @swagger
 * /api/v1/auth/logout:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Logout
 *    description: access-token 쿠키 삭제
 *    responses:
 *      204:
 *        description: 로그아웃 성공
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const logout = (req, res, next) => {
  try {
    res.cookie(ACCESS_TOKEN_COOKIE, '', {});
    res.status(httpStatus.NO_CONTENT);
    return res.send({});
  } catch (err) {
    return next(err);
  }
};

/**
 * @swagger
 * /api/v1/auth/check:
 *  get:
 *    tags:
 *      - Auth
 *    summary: Login Check
 *    description: 아직 미구현
 *    responses:
 *      200:
 *        description: 로그인 확인
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