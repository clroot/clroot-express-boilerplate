import { UserDTO, UserRegisterForm } from '/dto';
import { UserService } from '/service';
import { User } from '/models';
import httpStatus from 'http-status';

export const register = async (req, res, next) => {
  let registerFormDTO;
  try {
    registerFormDTO = new UserRegisterForm(req.body);
  } catch (error) {
    return next(error);
  }

  const { email, username, password } = registerFormDTO;

  try {
    await UserService.register({ email, username, password });
    const createdUser = await User.findByEmail(email);

    res.status(httpStatus.CREATED);

    return res.json(new UserDTO(createdUser));
  } catch (error) {
    return next(error);
  }
};