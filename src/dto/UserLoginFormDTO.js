import { InvalidArgumentsError } from '/error';

class UserLoginFormDTO {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;

    if (!this.email || !this.password) {
      throw new InvalidArgumentsError('email, password 를 모두 입력해주세요.');
    }
  }
}

export default UserLoginFormDTO;