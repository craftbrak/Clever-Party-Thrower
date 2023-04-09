import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { ShoppingListItem } from "../../../shopping-list-items/entities/shopping-list-item.entity";

describe("queryShoppingListItem", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the ShoppingListItem exists", () => {
    let existingShoppingListItem: ShoppingListItem;
    beforeAll(async () => {
      const e = await integrationTestManager.getNewEvent();
      existingShoppingListItem =
        await integrationTestManager.getNewShoppingListItem(e);
    });

    describe("When querying a shoppingListItem by its ID", () => {
      let queriedShoppingListItem: ShoppingListItem;
      beforeAll(async () => {
        const query = gql`
          query GetShoppingListItem($shoppingListItemId: String!) {
            shoppingListItem(id: $shoppingListItemId) {
              id
              name
              price
              assigned {
                id
              }
              bought
              event {
                id
              }
            }
          }
        `;
        const response = await request<{ shoppingListItem: ShoppingListItem }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ shoppingListItemId: existingShoppingListItem.id })
          .expectNoErrors();
        queriedShoppingListItem = response.data.shoppingListItem;
      });

      test("Then the response should be the queried ShoppingListItem", () => {
        expect(queriedShoppingListItem).toMatchObject({
          id: existingShoppingListItem.id,
          name: existingShoppingListItem.name,
          price: existingShoppingListItem.price,
          assigned: { id: existingShoppingListItem.assigned.id },
          bought: existingShoppingListItem.bought,
          event: { id: existingShoppingListItem.event.id },
          // Include any other fields you want to compare
        });
      });
    });
  });
});
