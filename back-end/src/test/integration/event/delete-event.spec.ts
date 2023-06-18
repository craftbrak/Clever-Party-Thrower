import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Event } from "../../../event/entities/event.entity";
import { UserRole } from "../../../event-to-user/entities/event-to-user.entity";

describe("deleteEvent", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the event already exist", () => {
    describe("When the event is removed ", () => {
      let deletedEventId: string;
      let existingEvent: Event;
      beforeAll(async () => {
        existingEvent = await integrationTestManager.getNewEvent();
        const etu = await integrationTestManager.getNewEventToUser(
          existingEvent,
          integrationTestManager.testUser,
          null,
          UserRole.OWNER,
        );
        const querry = gql`
          mutation RemoveEvent($removeEventId: String!) {
            removeEvent(id: $removeEventId)
          }
        `;
        const response = await request<{ removeEvent: string }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(querry)
          .variables({
            removeEventId: existingEvent.id,
          })
          .expectNoErrors();
        deletedEventId = response.data.removeEvent;
      });
      test("Then the response should be the deleted Event's id", () => {
        expect(deletedEventId).toMatch(existingEvent.id);
      });
      test("Then the event should not be in the database", async () => {
        const event = await integrationTestManager.dataSource
          .getRepository(Event)
          .findOneBy({ id: deletedEventId });
        expect(event).toBeNull();
      });
    });
  });
});
