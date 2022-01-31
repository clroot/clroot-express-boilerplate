import { PageDTO, PageRequestDTO, UserDTO } from '/dto';
import { User } from '/models';

/**
 * @swagger
 * /api/v1/admin/user/list:
 *  get:
 *    tags:
 *      - Admin
 *    summary: User List
 *    description: User 리스트 조회
 *    parameters:
 *      - in: query
 *        name: page
 *        required: true
 *        schema:
 *          type: string
 *          default: 1
 *      - in: query
 *        name: size
 *        required: true
 *        schema:
 *          type: string
 *          default: 30
 *    responses:
 *      200:
 *        description: User 리스트 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PageDTO'
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const list = async (req, res, next) => {
  const pageRequestDTO = PageRequestDTO.of(req.query);
  try {
    const userList = await User.findAll({
      ...pageRequestDTO.toQuery(),
    });
    const userCount = await User.count();

    res.send(new PageDTO({
      pageRequestDTO,
      content: userList.map(iter => (new UserDTO(iter))),
      totalElements: userCount,
    }));
  } catch (err) {
    next(err);
  }
};