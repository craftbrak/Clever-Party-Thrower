import { IntegrationTestManager } from "../../integration-test-manager";
import { User } from "../../../user/entities/user.entity";
import request from "supertest-graphql";
import gql from "graphql-tag";
import { userMock1, userMock2 } from "../../mock/user.mock";

describe("createUser", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the user doesn't already exist", () => {
    describe("When a new user is registered without an address ", () => {
      let createdUser: User;

      beforeAll(async () => {
        const querry = gql`
          mutation CreateUser($createUserData: CreateUserDto!) {
            createUser(singUp: $createUserData) {
              id
              email
              name
              addressId
              drivingLicence
              avatar
              manual
            }
          }
        `;
        const response = await request<{ createUser: User }>(
          integrationTestManager.httpServer,
        )
          .mutate(querry)
          .variables({
            createUserData: {
              ...userMock2,
            },
          })
          .expectNoErrors();
        createdUser = response.data.createUser;
      });
      test("Then the response should be the created user", () => {
        expect(createdUser).toMatchObject({
          email: userMock2.email,
          name: userMock2.name,
          drivingLicence: userMock2.drivingLicence,
          manual: userMock2.manual,
          addressId: null,
        });
      });
      test("Then the user should have an id", async () => {
        expect(createdUser.id).toBeTruthy();
      });
      test("Then the user should not have an Address", async () => {
        expect(createdUser.addressId).toBeNull();
      });
      test("Then the user should be in the database", async () => {
        const user = await integrationTestManager.dataSource
          .getRepository(User)
          .findOneByOrFail({ id: createdUser.id });
        expect(user).toBeDefined();
      });
    });
    describe("When a new user is registered with an existing address ", () => {
      let createdUser: User;

      beforeAll(async () => {
        const querry = gql`
          mutation CreateUser($createUserData: CreateUserDto!) {
            createUser(singUp: $createUserData) {
              id
              email
              name
              addressId
              drivingLicence
              avatar
              manual
              address {
                id
                streetNumber
              }
            }
          }
        `;
        const response = await request<{ createUser: User }>(
          integrationTestManager.httpServer,
        )
          .mutate(querry)
          .variables({
            createUserData: {
              ...userMock1,
              addressId: integrationTestManager.testAddress.id,
            },
          })
          .expectNoErrors();
        createdUser = response.data.createUser;
      });
      test("Then the response should be the created user", () => {
        expect(createdUser).toMatchObject({
          email: userMock1.email,
          name: userMock1.name,
          drivingLicence: userMock1.drivingLicence,
          manual: userMock1.manual,
          addressId: integrationTestManager.testAddress.id,
        });
      });
      test("Then the user should have an id", async () => {
        expect(createdUser.id).toBeTruthy();
      });
      test("Then the user should have an Address", async () => {
        expect(createdUser.addressId).toBeTruthy();
        expect(createdUser.address).toBeDefined();
        expect(createdUser.address.id).toBeTruthy();
        expect(createdUser.address.streetNumber).toEqual(
          integrationTestManager.testAddress.streetNumber,
        );
      });
      test("Then the user should be in the database", async () => {
        const user = await integrationTestManager.dataSource
          .getRepository(User)
          .findOneByOrFail({ id: createdUser.id });
        expect(user).toBeDefined();
      });
    });
  });
});
