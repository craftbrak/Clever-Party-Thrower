import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Event } from "../../../event/entities/event.entity";

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
    });

    describe("When querying an event by its ID", () => {
      let queriedEvent: Event;
      beforeAll(async () => {
        const query = gql`
          query GetEvent($eventId: String!) {
            event(id: $eventId) {
              id
              name
              description
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
          // Include any other fields you want to compare
        });
      });
    });
  });
});
