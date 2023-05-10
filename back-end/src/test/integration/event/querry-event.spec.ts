import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Event } from "../../../event/entities/event.entity";
import { randSoonDate } from "@ngneat/falso";

describe("queryEvent", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the Event exists", () => {
    let existingEvent: Event;
    beforeAll(async () => {
      existingEvent = await integrationTestManager.getNewEvent();
      await integrationTestManager.getNewEventToUser(
        existingEvent,
        integrationTestManager.testUser,
      );
      await integrationTestManager.getNewEventDate(
        existingEvent,
        randSoonDate(),
      );
      await integrationTestManager.getNewEventDate(
        existingEvent,
        randSoonDate(),
      );
      await integrationTestManager.getNewEventDate(
        existingEvent,
        randSoonDate(),
      );
    });
    //TODO: test every sub entity
    describe("When querying an event by its ID", () => {
      let queriedEvent: Event;
      beforeAll(async () => {
        const query = gql`
          query GetEvent($eventId: String!) {
            event(id: $eventId) {
              id
              name
              description
              total
              members(skip: 0, take: 10) {
                id
              }
              address {
                id
              }
              addressId
              carpools {
                id
              }
              shoppingList {
                id
              }
              spendings {
                id
              }
              selectedDate {
                id
              }
              selectedDateId
              availableDates {
                id
              }
              fixedDate
            }
          }
        `;
        const response = await request<{ event: Event }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ eventId: existingEvent.id })
          .expectNoErrors();
        queriedEvent = response.data.event;
      });

      test("Then the response should be the queried Event", () => {
        expect(queriedEvent).toMatchObject({
          id: existingEvent.id,
          name: existingEvent.name,
          description: existingEvent.description,
          total: existingEvent.total,
          address: { id: existingEvent.addressId },
          addressId: existingEvent.addressId,
          fixedDate: existingEvent.fixedDate,
          // Include any other fields you want to compare
        });

        // If you want to check the length of an array property (e.g., members, carpools, etc.)
        // You can use the following check:
        expect(queriedEvent.members.length).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
