import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { CreateEventDateInput } from "../../../event-dates/dto/create-event-date.input";
import { EventDate } from "../../../event-dates/entities/event-date.entity";
import { EventDateMock } from "../../mock/event-date.mock";

describe("createEventDate", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the EventDate doesn't already exist", () => {
    describe("When a new EventDate is registered", () => {
      let createEventDate: EventDate;
      let eventDateMock: CreateEventDateInput;
      beforeAll(async () => {
        eventDateMock = await EventDateMock(
          await integrationTestManager.getNewEvent(),
        );
        const query = gql`
          mutation CreateEventDate($createEventDate: CreateEventDateInput!) {
            createEventDate(createEventDateInput: $createEventDate) {
              id
              eventId
              date
            }
          }
        `;
        const response = await request<{ createEventDate: EventDate }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(query)
          .variables({
            createEventDate: {
              ...eventDateMock,
            },
          })
          .expectNoErrors();
        createEventDate = response.data.createEventDate;
      });
      test("Then the response should be the created EventDate", () => {
        expect(createEventDate.date).toEqual(
          new Date(eventDateMock.date).getTime().toString(),
        );
      });
      test("Then the EventDate should have an id", async () => {
        expect(createEventDate.id).toBeTruthy();
      });
      test("Then the EventDate should have an event", async () => {
        expect(createEventDate.eventId).toBeTruthy();
      });
      test("Then the EventDate should be in the database", async () => {
        const eventDateItem = await integrationTestManager.dataSource
          .getRepository(EventDate)
          .findOneByOrFail({ id: createEventDate.id });
        expect(eventDateItem).toBeDefined();
      });
    });
  });
});
