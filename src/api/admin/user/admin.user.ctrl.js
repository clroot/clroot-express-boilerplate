/**
 * User List 조회
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const list = async (req, res, next) => {
  try {
    res.send({
      list: [],
    });
  } catch (err) {
    next(err);
  }
};