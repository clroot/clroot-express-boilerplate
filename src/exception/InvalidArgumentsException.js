class InvalidArgumentsException extends Error {
  constructor(message = 'Arguments 가 부족합니다.') {
    super(message);
    this.name = this.constructor.name;
  }
}

export default InvalidArgumentsException;