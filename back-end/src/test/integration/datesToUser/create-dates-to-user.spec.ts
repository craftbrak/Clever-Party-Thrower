import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { DatesToUser } from "../../../dates-to-user/entities/dates-to-user.entity";
import { CreateDatesToUserInput } from "../../../dates-to-user/dto/create-dates-to-user.input";
import { DatesToUserMock } from "../../mock/DatesToUser.mock";

describe("createDatesToUser", () => {
  jest.setTimeout(80000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the DatesToUser doesn't already exist", () => {
    describe("When a new DatesToUser is registered", () => {
      let createDatesToUser: DatesToUser;
      let datesToUserMock: CreateDatesToUserInput;

      beforeAll(async () => {
        const e = await integrationTestManager.getNewEvent();
        datesToUserMock = await DatesToUserMock(
          await integrationTestManager.getNewEventDate(e),
          await integrationTestManager.getNewEventToUser(e),
        );
        const query = gql`
          mutation CreateDatesToUser(
            $createDatesToUser: CreateDatesToUserInput!
          ) {
            createDatesToUser(createDatesToUserInput: $createDatesToUser) {
              id
              eventDateId
              eventToUserId
            }
          }
        `;
        const response = await request<{ createDatesToUser: DatesToUser }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(query)
          .variables({
            createDatesToUser: {
              ...datesToUserMock,
            },
          })
          .expectNoErrors();
        createDatesToUser = response.data.createDatesToUser;
      });
      test("Then the response should be the created DatesToUser", () => {
        expect(createDatesToUser).toMatchObject({
          eventToUserId: datesToUserMock.eventToUserId,
          eventDateId: datesToUserMock.eventDateId,
        });
      });
      test("Then the DatesToUser should have an id", async () => {
        expect(createDatesToUser.id).toBeTruthy();
      });
      test("Then the DatesToUser should be in the database", async () => {
        const datesToUserItem = await integrationTestManager.dataSource
          .getRepository(DatesToUser)
          .findOneByOrFail({ id: createDatesToUser.id });
        expect(datesToUserItem).toBeDefined();
      });
    });
  });
});
