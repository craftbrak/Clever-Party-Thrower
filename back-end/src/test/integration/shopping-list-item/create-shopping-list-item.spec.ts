import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { ShoppingListItem } from "../../../shopping-list-items/entities/shopping-list-item.entity";
import { CreateShoppingListItemDto } from "../../../shopping-list-items/dto/create-shopping-list-item.dto";
import { ShoppingListItemMock } from "../../mock/shoppingListItem.mock";

describe("createShoppingListItem", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the Item doesn't already exist", () => {
    describe("When a new item is registered ", () => {
      let createdShoppingListItem: ShoppingListItem;
      let shoppingListItemMock: CreateShoppingListItemDto;
      beforeAll(async () => {
        shoppingListItemMock = await ShoppingListItemMock(
          await integrationTestManager.getNewEvent(),
          await integrationTestManager.getNewUser(),
        );
        const query = gql`
          mutation CreateShoppingListItem(
            $createShoppingListItem: CreateShoppingListItemDto!
          ) {
            createShoppingListItem(
              createShoppingListItemDto: $createShoppingListItem
            ) {
              id
              name
              assigned {
                id
              }
              bought
              event {
                id
              }
              price
            }
          }
        `;
        const response = await request<{
          createShoppingListItem: ShoppingListItem;
        }>(integrationTestManager.httpServer)
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(query)
          .variables({
            createShoppingListItem: {
              ...shoppingListItemMock,
            },
          })
          .expectNoErrors();
        createdShoppingListItem = response.data.createShoppingListItem;
      });
      test("Then the response should be the created item", () => {
        expect(createdShoppingListItem).toMatchObject({
          name: shoppingListItemMock.name,
          bought: shoppingListItemMock.bought,
          price: shoppingListItemMock.price,
        });
      });
      test("Then the item should have an id", async () => {
        expect(createdShoppingListItem.id).toBeTruthy();
      });
      test("Then the item should have an event", async () => {
        expect(createdShoppingListItem.event.id).toBeTruthy();
      });
      test("Then the item should have an user", async () => {
        expect(createdShoppingListItem.assigned.id).toBeTruthy();
      });
      test("Then the item should be in the database", async () => {
        const shoppingListItem = await integrationTestManager.dataSource
          .getRepository(ShoppingListItem)
          .findOneByOrFail({ id: createdShoppingListItem.id });
        expect(shoppingListItem).toBeDefined();
      });
    });
  });
});
