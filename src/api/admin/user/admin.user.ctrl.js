import { User } from '/models';

/**
 * User List 조회
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const list = async (req, res, next) => {
  try {
    const userList = await User.findAll();
    res.send(userList);
  } catch (err) {
    next(err);
  }
};