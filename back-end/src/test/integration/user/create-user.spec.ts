import { IntegrationTestManager } from "../../integration-test-manager";
import { User } from "../../../user/entities/user.entity";
import request from "supertest-graphql";
import gql from "graphql-tag";
import { userStub } from "../../mock/user.mock";

describe("createUser", () => {
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("give that the user doesn't already exist", () => {
    describe("when a createUser mutation is executed", () => {
      let createdUser: User;

      beforeAll(async () => {
        const response = await request<{ createUser: User }>(
          integrationTestManager.httpServer,
        )
          .mutate(
            gql`
              mutation CreateUser($createUserData: CreateUserDto!) {
                createUser(createUserInput: $createUserData) {
                  id
                  email
                  name
                }
              }
            `,
          )
          .variables({ userStub })
          .expectNoErrors();
        createdUser = response.data.createUser;
      });
      test("then the response should be the created user", () => {
        expect(createdUser.email).toMatchObject({
          ...userStub,
        });
      });
    });
  });
});
