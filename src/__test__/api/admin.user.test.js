import request from 'supertest';
import httpStatus from 'http-status';
import { randEmail, randPassword, randUserName } from '@ngneat/falso';
import { closeServer, startServer } from '/index';
import { User, UserRole } from '/models';
import { PageRequestDTO } from '/dto';
import { createTestUser, getAccessTokenCookies, removeTestUser } from '/__test__/helper';

describe('admin API 의', () => {
  const apiPrefix = '/api/v1/admin/user';
  let server;
  let adminUser;
  let cookies;

  const testUserEmail = randEmail();
  const testUsername = randUserName();
  const testUserPassword = randPassword();

  const userPayload = {
    email: testUserEmail,
    username: testUsername,
    password: testUserPassword,
  };

  beforeAll(async () => {
    server = await startServer();

    await createTestUser(userPayload);
    adminUser = await User.findByEmail(testUserEmail);

    adminUser.role = UserRole.ADMIN;
    await adminUser.save();

    cookies = await getAccessTokenCookies(server, {
      email: testUserEmail,
      password: testUserPassword,
    });
  });

  afterAll(async () => {
    await removeTestUser(userPayload);
    await closeServer(server);
  });

  describe('/user/list 는', () => {
    const route = `${apiPrefix}/list`;

    const dummyCount = 50;
    const dummyUserList = [];

    beforeAll(async () => {
      const promise = Array.from({ length: dummyCount }).map(async () => {
        const email = randEmail();
        dummyUserList.push(email);
        await createTestUser({
          email,
          username: randUserName(),
          password: randPassword(),
        });
      });

      await Promise.all(promise);
    });

    afterAll(async () => {
      const promise = dummyUserList.map(async (email) => {
        await removeTestUser({ email });
      });

      await Promise.all(promise);
    });

    describe('성공시', () => {
      it('PageDTO<UserDTO> 객체를 return 한다.', async () => {
        const pageRequestDTO = PageRequestDTO.of({
          page: 1,
          size: 30,
        });

        const {
          body: {
            content,
            pageable,
            totalElements,
            first,
            last,
          },
        } = await request(server)
          .get(route)
          .query({ ...pageRequestDTO })
          .set('Cookie', cookies)
          .expect(httpStatus.OK);

        expect(content).toBeInstanceOf(Array);
        expect(content.length).toBeLessThanOrEqual(30);
        expect(totalElements).toBeGreaterThanOrEqual(dummyCount);
        expect(first).toBeTruthy();
        expect(last).toBeFalsy();
        expect(pageable).toStrictEqual({
          pageNumber: pageRequestDTO.page,
          pageSize: pageRequestDTO.size,
        });
      });

      it('PageDTO<UserDTO> 객체 page 처리 확인.', async () => {
        //given
        const pageRequestDTO1 = PageRequestDTO.of({
          page: 1,
          size: 30,
        });
        const pageRequestDTO2 = PageRequestDTO.of({
          page: 2,
          size: 30,
        });

        //when
        const {
          body: response1,
        } = await request(server)
          .get(route)
          .query({ ...pageRequestDTO1 })
          .set('Cookie', cookies)
          .expect(httpStatus.OK);
        const {
          body: response2,
        } = await request(server)
          .get(route)
          .query({ ...pageRequestDTO2 })
          .set('Cookie', cookies)
          .expect(httpStatus.OK);

        //then
        expect(response1.pageable).not.toStrictEqual(response2.pageable);
        expect(response1.totalElements).toStrictEqual(response2.totalElements);
        expect(response1.totalPages).toStrictEqual(response2.totalPages);
        expect(response1.content[0]).not.toStrictEqual(response2.content[0]);
      });
    });
  });
});