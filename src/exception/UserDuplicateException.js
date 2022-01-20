class UserDuplicateException extends Error {
  constructor(message = '이미 가입된 이메일입니다.') {
    super(message);
    this.name = this.constructor.name;
  }
}

export default UserDuplicateException;