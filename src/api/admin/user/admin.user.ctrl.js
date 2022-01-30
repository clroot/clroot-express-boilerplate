export const list = async (req, res, next) => {
  try {
    res.send({
      list: [],
    });
  } catch (err) {
    next(err);
  }
};