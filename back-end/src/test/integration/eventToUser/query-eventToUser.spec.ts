import { EventToUser } from "../../../event-to-user/entities/event-to-user.entity";
import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";

describe("queryEventToUser", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the EventToUser exists", () => {
    let existingEventToUser: EventToUser;
    beforeAll(async () => {
      const e = await integrationTestManager.getNewEvent();
      existingEventToUser = await integrationTestManager.getNewEventToUser(
        e,
        integrationTestManager.testUser,
      );
      const edate1 = await integrationTestManager.getNewEventDate(e);
      const edate2 = await integrationTestManager.getNewEventDate(e);
      await integrationTestManager.getNewDatesToUser(
        existingEventToUser,
        edate1,
      );
      await integrationTestManager.getNewDatesToUser(
        existingEventToUser,
        edate2,
      );
    });

    describe("When querying an eventToUser by its ID", () => {
      let queriedEventToUser: EventToUser;
      beforeAll(async () => {
        const query = gql`
          query GetEventToUser($eventToUserId: String!) {
            eventToUser(id: $eventToUserId) {
              id
              userId
              eventId
              user {
                id
              }
              event {
                id
              }
              address {
                id
              }
              role
              availableDates {
                id
              }
            }
          }
        `;
        const response = await request<{ eventToUser: EventToUser }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ eventToUserId: existingEventToUser.id })
          .expectNoErrors();
        queriedEventToUser = response.data.eventToUser;
      });

      test("Then the response should be the queried EventToUser", () => {
        expect(queriedEventToUser).toMatchObject({
          id: existingEventToUser.id,
          userId: existingEventToUser.userId,
          eventId: existingEventToUser.eventId,
          user: { id: existingEventToUser.userId },
          event: { id: existingEventToUser.eventId },
          address: { id: existingEventToUser.addressId },
          role: existingEventToUser.role,
          // Include any other fields you want to compare
        });

        // If you want to check the length of an array property (e.g., availableDates)
        // You can use the following check:
        expect(queriedEventToUser.availableDates.length).toBeGreaterThanOrEqual(
          1,
        );
      });
    });
  });
});
