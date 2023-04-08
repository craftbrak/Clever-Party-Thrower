import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Event } from "../../../event/entities/event.entity";
import { EventMock } from "../../mock/event.mock";

describe("createEvent", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the event doesn't already exist", () => {
    describe("When a new event is registered ", () => {
      let createdEvent: Event;
      beforeAll(async () => {
        const querry = gql`
          mutation CreateEvent($createEventDto: CreateEventDto!) {
            createEvent(createEventInput: $createEventDto) {
              id
              name
              description
              total
              addressId
              address {
                id
              }
              fixedDate
            }
          }
        `;
        const response = await request<{ createEvent: Event }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(querry)
          .variables({
            createEventDto: {
              ...EventMock,
              addressId: integrationTestManager.testAddress.id,
            },
          })
          .expectNoErrors();
        createdEvent = response.data.createEvent;
      });
      test("Then the response should be the created Event", () => {
        expect(createdEvent).toMatchObject({
          ...EventMock,
          addressId: integrationTestManager.testAddress.id,
        });
      });
      test("Then the event should have an id", async () => {
        expect(createdEvent.id).toBeTruthy();
      });
      test("Then the event should not have an address", async () => {
        expect(createdEvent.address.id).toEqual(
          integrationTestManager.testAddress.id,
        );
      });
      test("Then the event should be in the database", async () => {
        const event = await integrationTestManager.dataSource
          .getRepository(Event)
          .findOneByOrFail({ id: createdEvent.id });
        expect(event).toBeDefined();
      });
    });
  });
});
