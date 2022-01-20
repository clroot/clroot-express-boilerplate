class IllegalStateException extends Error {
  constructor(message = '서버 내부 오류가 발생했습니다.') {
    super(message);
    this.name = this.constructor.name;
  }
}

export default IllegalStateException;