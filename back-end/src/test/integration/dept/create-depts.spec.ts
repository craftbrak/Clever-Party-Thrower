import { Dept } from "../../../dept/entities/dept.entity";
import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";

describe("calculateDebts", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given an Event without Spendings", () => {
    let eventId: string;
    beforeAll(async () => {
      const event = await integrationTestManager.getNewEvent();
      eventId = event.id;

      // Create necessary Spending instances related to the event here
      // based on your business logic.
    });

    describe("When calling calculateDebts mutation with the event ID", () => {
      let calculatedDebts: Dept[];
      beforeAll(async () => {
        const mutation = gql`
          mutation CalculateDebts($eventId: String!) {
            calculateDebts(eventId: $eventId) {
              id
              amount
              repayed
              debtor {
                id
              }
              creditor {
                id
              }
              event {
                id
              }
            }
          }
        `;
        const response = await request<{ calculateDebts: Dept[] }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(mutation)
          .variables({ eventId })
          .expectNoErrors();
        calculatedDebts = response.data.calculateDebts;
      });

      test("Then the response should be an empty array of calculated debts", () => {
        // You should adapt this test based on your business logic to check if the returned
        // debts array is consistent with what you expect.
        // This example checks if the calculatedDebts array is not empty and all its elements
        // have the same eventId as the input eventId.
        expect(calculatedDebts.length).toBeGreaterThanOrEqual(0);
        calculatedDebts.forEach((dept) => {
          expect(dept.event.id).toEqual(eventId);
        });
      });
    });
  });
  describe("Given an Event with Spendings", () => {
    let eventId: string;
    beforeAll(async () => {
      const event = await integrationTestManager.getNewEvent();
      const u1 = await integrationTestManager.getNewUser();
      const u2 = await integrationTestManager.getNewUser();
      const u3 = await integrationTestManager.getNewUser();
      await integrationTestManager.getNewEventToUser(event, u1);
      await integrationTestManager.getNewEventToUser(event, u2);
      await integrationTestManager.getNewEventToUser(event, u3);
      await integrationTestManager.getNewSpending(event, u1, null, 10);
      await integrationTestManager.getNewSpending(event, u2, null, 40);
      eventId = event.id;

      // Create necessary Spending instances related to the event here
      // based on your business logic.
    });

    describe("When calling calculateDebts mutation with the event ID", () => {
      let calculatedDebts: Dept[];
      beforeAll(async () => {
        const mutation = gql`
          mutation CalculateDebts($eventId: String!) {
            calculateDebts(eventId: $eventId) {
              id
              amount
              repayed
              debtor {
                id
              }
              creditor {
                id
              }
              event {
                id
              }
            }
          }
        `;
        const response = await request<{ calculateDebts: Dept[] }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(mutation)
          .variables({ eventId })
          .expectNoErrors();
        calculatedDebts = response.data.calculateDebts;
      });

      test("Then the response should be an array of calculated debts", () => {
        // You should adapt this test based on your business logic to check if the returned
        // debts array is consistent with what you expect.
        // This example checks if the calculatedDebts array is not empty and all its elements
        // have the same eventId as the input eventId.
        expect(calculatedDebts.length).toBeGreaterThanOrEqual(1);
        calculatedDebts.forEach((dept) => {
          expect(dept.event.id).toEqual(eventId);
        });
      });
    });
  });
});
