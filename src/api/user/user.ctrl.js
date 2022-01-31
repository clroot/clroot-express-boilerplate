import { UserDTO, UserRegisterFormDTO } from '/dto';
import { UserService } from '/service';
import { User } from '/models';
import httpStatus from 'http-status';

/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *    tags:
 *      - User
 *    summary: Register
 *    description: User 회원 가입
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserRegisterFormDTO'
 *    responses:
 *      201:
 *        description: 회원가입 성공
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserDTO'
 *      400:
 *        description: 회원가입 정보 누락
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorDTO'
 *      409:
 *        description: 중복된 이메일이 이미 가입됨
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorDTO'
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const register = async (req, res, next) => {
  let userRegisterFormDTO;
  try {
    userRegisterFormDTO = new UserRegisterFormDTO(req.body);
  } catch (error) {
    return next(error);
  }

  const { email, username, password } = userRegisterFormDTO;

  try {
    await UserService.register({ email, username, password });
    const createdUser = await User.findByEmail(email);

    res.status(httpStatus.CREATED);

    return res.json(new UserDTO(createdUser));
  } catch (error) {
    return next(error);
  }
};