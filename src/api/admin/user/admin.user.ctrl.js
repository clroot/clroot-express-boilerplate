import { PageDTO, PageRequestDTO, UserDTO } from '/dto';
import { User } from '/models';

/**
 * User List 조회
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