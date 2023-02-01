import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { testUser } from "../../mock/user.mock";
import { AuthOutputDto } from "../../../auth/dto/auth-output.dto";

describe("login", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the user is not logged in and the 2fa is disable", () => {
    describe("When a user logs in ", () => {
      let login: AuthOutputDto;
      beforeAll(async () => {
        const query = gql`
          mutation login($input: AuthInputDto!) {
            authLogin(authInputDto: $input) {
              accessToken
              refreshToken
            }
          }
        `;
        const response = await request<{ authLogin: AuthOutputDto }>(
          integrationTestManager.httpServer,
        )
          .mutate(query)
          .variables({
            input: {
              password: testUser.password,
              email: testUser.email,
            },
          });
        login = response.data.authLogin;
      });
      test("Then the response should be the created the token", () => {
        expect(login.accessToken).toBeTruthy();
        expect(login.accessToken.length).toEqual(
          integrationTestManager.accessToken.accessToken.length,
        );
      });
    });
  });
});
