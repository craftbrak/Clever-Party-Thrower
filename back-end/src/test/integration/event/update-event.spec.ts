import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Event } from "../../../event/entities/event.entity";
import { EventMock } from "../../mock/event.mock";

describe("updateEvent", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the event already exist", () => {
    describe("When the event is updated ", () => {
      let updatedEvent: Event;
      let existingEvent: Event;
      beforeAll(async () => {
        existingEvent = await integrationTestManager.getNewEvent();
        const querry = gql`
          mutation UpdateEvent($updateEventDto: UpdateEventDto!) {
            updateEvent(updateEventInput: $updateEventDto) {
              id
              name
              description
              addressId
              address {
                id
              }
              fixedDate
            }
          }
        `;
        const response = await request<{ updateEvent: Event }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(querry)
          .variables({
            updateEventDto: {
              ...EventMock,
              id: existingEvent.id,
              addressId: integrationTestManager.testAddress.id,
            },
          })
          .expectNoErrors();
        updatedEvent = response.data.updateEvent;
      });
      test("Then the response should be the updated Event", () => {
        expect(updatedEvent.id).toMatch(existingEvent.id);
        expect(updatedEvent.address.id).toMatch(
          integrationTestManager.testAddress.id,
        );
        expect(updatedEvent.name).toMatch(EventMock.name);
        expect(updatedEvent.description).toMatch(EventMock.description);
      });
      test("Then the event should be in the database", async () => {
        const event = await integrationTestManager.dataSource
          .getRepository(Event)
          .findOneByOrFail({ id: updatedEvent.id });
        expect(event).toBeDefined();
      });
    });
  });
});
