import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { testUser } from "../../mock/user.mock";
import { AuthLoginOutput } from "../../../auth/dto/auth-login.dto";

describe("login", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the user is not logged in ", () => {
    describe("When a user logs in ", () => {
      let login: AuthLoginOutput;
      console.log(integrationTestManager.accessToken);
      beforeAll(async () => {
        const querry = gql`
          mutation login($psw: String!, $email: String!) {
            authLogin(password: $psw, username: $email) {
              accessToken
            }
          }
        `;
        const response = await request<{ authLogin: AuthLoginOutput }>(
          integrationTestManager.httpServer,
        )
          .mutate(querry)
          .variables({
            psw: testUser.password,
            email: testUser.email,
          })
          .expectNoErrors();
        login = response.data.authLogin;
      });
      test("Then the response should be the created the token", () => {
        console.table(login);
        expect(login.accessToken).toBeTruthy();
        expect(login.accessToken.length).toEqual(
          integrationTestManager.accessToken.accessToken.length,
        );
      });
    });
  });
});
