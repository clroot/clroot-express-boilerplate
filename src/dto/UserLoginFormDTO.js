import { InvalidArgumentsException } from '/exception';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLoginFormDTO:
 *       properties:
 *         email:
 *           type: string
 *           default: test@email.com
 *         password:
 *           type: string
 *           default: test-password
 */
class UserLoginFormDTO {
  /**
   * @param {Object} payload
   * @param {string} payload.email
   * @param {string} payload.username
   * @param {string} payload.password
   * @throws {IllegalStateException}
   */
  constructor(payload) {
    this.email = payload.email;
    this.password = payload.password;

    if (!this.email || !this.password) {
      throw new InvalidArgumentsException('email, password 를 모두 입력해주세요.');
    }
  }
}

export default UserLoginFormDTO;