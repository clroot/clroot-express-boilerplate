import { IllegalStateException } from '/exception';

class UserDTO {
  /**
   * @param {import('/models').User} payload
   * @throws {IllegalStateException}
   */
  constructor(payload) {
    this.email = payload.email;
    this.username = payload.username;
    this.role = payload.role;

    if (!this.email || !this.username) {
      throw new IllegalStateException('옳바른 User 객체가 아닙니다.');
    }
  }
}

export default UserDTO;