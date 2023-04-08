import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { DatesToUser } from "../../../dates-to-user/entities/dates-to-user.entity";

describe("queryDatesToUser", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the DatesToUser exists", () => {
    let existingDatesToUser: DatesToUser;
    beforeAll(async () => {
      existingDatesToUser = await integrationTestManager.getNewDatesToUser();
    });

    describe("When querying a DatesToUser by its ID", () => {
      let queriedDatesToUser: DatesToUser;
      beforeAll(async () => {
        const query = gql`
          query GetDatesToUser($datesToUserId: String!) {
            datesToUser(id: $datesToUserId) {
              id
              eventDate {
                id
              }
              eventToUser {
                id
              }
              voteValue
            }
          }
        `;
        const response = await request<{ datesToUser: DatesToUser }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ datesToUserId: existingDatesToUser.id })
          .expectNoErrors();
        queriedDatesToUser = response.data.datesToUser;
      });

      test("Then the response should be the queried DatesToUser", () => {
        expect(queriedDatesToUser).toMatchObject({
          id: existingDatesToUser.id,
          eventDate: {
            id: existingDatesToUser.eventDateId,
          },
          eventToUser: {
            id: existingatesToUser.eventToUserId,
          },
          voteValue: existingDatesToUser.voteValu,
        });
      });
    });
  });
});
