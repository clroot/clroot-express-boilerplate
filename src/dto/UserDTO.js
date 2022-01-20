import { IllegalStateException } from '/exception';

class UserDTO {
  constructor(payload) {
    this.email = payload.email;
    this.username = payload.username;

    if (!this.email || !this.username) {
      throw new IllegalStateException('옳바른 User 객체가 아닙니다.');
    }
  }
}

export default UserDTO;