class UserNotFoundException extends Error {
  constructor(message = '가입되지 않은 이메일입니다.') {
    super(message);
    this.name = this.constructor.name;
  }
}

export default UserNotFoundException;