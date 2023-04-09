import { EventDate } from "../../../event-dates/entities/event-date.entity";
import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";

describe("queryEventDate", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the EventDate exists", () => {
    let existingEventDate: EventDate;
    beforeAll(async () => {
      const e = await integrationTestManager.getNewEvent();
      const etu = await integrationTestManager.getNewEventToUser(
        e,
        integrationTestManager.testUser,
      );
      existingEventDate = await integrationTestManager.getNewEventDate(e);
      const dtu = await integrationTestManager.getNewDatesToUser(
        etu,
        existingEventDate,
      );
    });

    describe("When querying an eventDate by its ID", () => {
      let queriedEventDate: EventDate;
      beforeAll(async () => {
        const query = gql`
          query GetEventDate($eventDateId: String!) {
            eventDate(id: $eventDateId) {
              id
              date
              eventId
              numberVotes
              event {
                id
              }
              datesToUsers {
                id
              }
            }
          }
        `;
        const response = await request<{ eventDate: EventDate }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ eventDateId: existingEventDate.id })
          .expectNoErrors();
        queriedEventDate = response.data.eventDate;
      });

      test("Then the response should be the queried EventDate", () => {
        expect(queriedEventDate).toMatchObject({
          id: existingEventDate.id,
          date: new Date(existingEventDate.date).getTime().toString(),
          eventId: existingEventDate.eventId,
          numberVotes: existingEventDate.numberVotes,
          event: { id: existingEventDate.eventId },
          // Include any other fields you want to compare
        });

        // If you want to check the length of an array property (e.g., datesToUsers)
        // You can use the following check:
        expect(queriedEventDate.datesToUsers.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
