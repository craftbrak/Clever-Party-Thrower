import { Spending } from "../../../spending/entities/spending.entity";
import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";

describe("querySpending", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the Spending exists", () => {
    let existingSpending: Spending;
    beforeAll(async () => {
      const e = await integrationTestManager.getNewEvent();
      const buyer = await integrationTestManager.getNewUser();
      const shoppingListItem =
        await integrationTestManager.getNewShoppingListItem(e);
      existingSpending = await integrationTestManager.getNewSpending(
        e,
        buyer,
        shoppingListItem,
      );
    });

    describe("When querying a spending by its ID", () => {
      let queriedSpending: Spending;
      beforeAll(async () => {
        const query = gql`
          query GetSpending($spendingId: String!) {
            spending(id: $spendingId) {
              id
              buyer {
                id
              }
              event {
                id
              }
              value
              shoppingListItem {
                id
              }
            }
          }
        `;
        const response = await request<{ spending: Spending }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ spendingId: existingSpending.id })
          .expectNoErrors();
        queriedSpending = response.data.spending;
      });

      test("Then the response should be the queried Spending", () => {
        expect(queriedSpending).toMatchObject({
          id: existingSpending.id,
          buyer: { id: existingSpending.buyer.id },
          event: { id: existingSpending.event.id },
          value: existingSpending.value,
          shoppingListItem: { id: existingSpending.shoppingListItem.id },
          // Include any other fields you want to compare
        });
      });
    });
  });
});
