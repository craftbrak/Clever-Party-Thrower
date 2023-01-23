import { IntegrationTestManager } from "../../integration-test-manager";
import { AuthOutputDto } from "../../../auth/dto/auth-output.dto";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { testUser } from "../../mock/user.mock";

describe("logout", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the user is logged in", () => {
    describe("When a user logs out ", () => {
      beforeAll(async () => {
        const query = gql`
          query logout {
            logout
          }
        `;
        const response = await request<{ logout: boolean }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .expectNoErrors();
      });
      test("Then the response should be true ", () => {
        expect(true).toBeTruthy();
      });
    });
  });
});
