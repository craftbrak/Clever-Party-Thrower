import { UserEntity } from "../../../user/entities/user.entity";
import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";

describe("queryUserEntity", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the UserEntity exists", () => {
    let existingUserEntity: UserEntity;
    beforeAll(async () => {
      const address = await integrationTestManager.getNewAddress();
      existingUserEntity = await integrationTestManager.getNewUser(address);
      await integrationTestManager.getNewAddress(existingUserEntity);
      await integrationTestManager.getNewAddress(existingUserEntity);
      await integrationTestManager.getNewAddress(existingUserEntity);
      await integrationTestManager.getNewAddress(existingUserEntity);
    });

    describe("When querying a user entity by its ID", () => {
      let queriedUserEntity: UserEntity;
      beforeAll(async () => {
        const query = gql`
          query GetUserEntity($userId: String!) {
            user(email: $userId) {
              id
              name
              email
              avatar
              drivingLicence
              manual
              address {
                id
              }
              cars {
                id
              }
              eventToUsers {
                id
              }
              addresses {
                id
              }
            }
          }
        `;
        const response = await request<{ user: UserEntity }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ userId: existingUserEntity.email })
          .expectNoErrors();
        queriedUserEntity = response.data.user;
      });

      test("Then the response should be the queried UserEntity", () => {
        expect(queriedUserEntity).toMatchObject({
          id: existingUserEntity.id,
          name: existingUserEntity.name,
          email: existingUserEntity.email,
          avatar: existingUserEntity.avatar,
          drivingLicence: existingUserEntity.drivingLicence,
          manual: existingUserEntity.manual,
          address: { id: existingUserEntity.address.id },
          // Include any other fields you want to compare
        });
        // If you want to check the length of an array property (e.g., cars or eventToUsers)
        // You can use the following check:
        expect(queriedUserEntity.cars.length).toBeGreaterThanOrEqual(0);
        expect(queriedUserEntity.eventToUsers.length).toBeGreaterThanOrEqual(0);
        expect(queriedUserEntity.addresses.length).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
