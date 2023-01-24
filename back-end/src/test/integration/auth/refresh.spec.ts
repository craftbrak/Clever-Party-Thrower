import { IntegrationTestManager } from "../../integration-test-manager";
import { AuthOutputDto } from "../../../auth/dto/auth-output.dto";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { testUser } from "../../mock/user.mock";

describe("refresh", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the user is loged in and the 2fa is disable but the access Token is no longer valid", () => {
    describe("When a user request a new access Token ", () => {
      let login: AuthOutputDto;

      beforeAll(async () => {
        const query = gql`
          mutation authRefresh($input: AuthRefreshDto!) {
            authRefresh(AuthRefreshDto: $input) {
              accessToken
              refreshToken
            }
          }
        `;
        const response = await request<{ authRefresh: AuthOutputDto }>(
          integrationTestManager.httpServer,
        )
          .mutate(query)
          .variables({
            input: {
              refreshToken: integrationTestManager.accessToken.refreshToken,
            },
          });
        login = response.data.authRefresh;
      });
      test("Then the response should be the new access and refresh token", () => {
        expect(login.accessToken).toBeTruthy();
        expect(login.accessToken.length).toEqual(
          integrationTestManager.accessToken.accessToken.length,
        );
      });
    });
  });
});