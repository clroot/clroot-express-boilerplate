import { InvalidArgumentsError } from '/error';

class UserRegisterFormDTO {
  constructor(data) {
    this.email = data.email;
    this.username = data.username;
    this.password = data.password;

    if (!this.email || !this.username || !this.password) {
      throw new InvalidArgumentsError('email, username, password 를 모두 입력해주세요.');
    }
  }
}

export default UserRegisterFormDTO;