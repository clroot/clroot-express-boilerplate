import { randEmail, randUserName } from '@ngneat/falso';
import { decodeToken, generateToken } from '/lib/token';

describe('lib/token.js 모듈의', () => {
  const email = randEmail();
  const username = randUserName();

  describe('generateToken 메서드는', () => {
    describe('성공시', () => {
      it('jwt 토큰을 발급한다.', () => {
        const token = generateToken({ email, username });

        expect(typeof token).toBe('string');
      });
    });
  });

  describe('decodeToken 메서드는', () => {
    let token = '';

    beforeAll(() => {
      token = generateToken({ email, username });
    });

    describe('성공시', () => {
      it('jwt 토큰을 파싱한다.', () => {
        const decode = decodeToken(token);
        const { email: decodedEmail, username: decodedUsername } = decode;

        expect(decodedEmail).toBe(email);
        expect(decodedUsername).toBe(username);
      });
    });
  });
});