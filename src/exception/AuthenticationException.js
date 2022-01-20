class AuthenticationException extends Error {
  constructor(message = '잘못된 비밀번호입니다.') {
    super(message);
    this.name = this.constructor.name;
  }
}

export default AuthenticationException;