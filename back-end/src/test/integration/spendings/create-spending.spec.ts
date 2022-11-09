import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Spending } from "../../../spending/entities/spending.entity";
import { CreateSpendingDto } from "../../../spending/dto/create-spending.dto";
import { SpendingMock } from "../../mock/spending.mock";

describe("createSpending", () => {
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
      let createSpending: Spending;
      let spendingMock: CreateSpendingDto;
      beforeAll(async () => {
        spendingMock = await SpendingMock(
          await integrationTestManager.getNewEvent(),
          await integrationTestManager.getNewUser(),
        );
        const query = gql`
          mutation CreateSpending($createSpending: CreateSpendingDto!) {
            createSpending(createSpendingInput: $createSpending) {
              id
              event {
                id
              }
              buyer {
                id
              }
              value
            }
          }
        `;
        const response = await request<{
          createSpending: Spending;
        }>(integrationTestManager.httpServer)
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(query)
          .variables({
            createSpending: {
              ...spendingMock,
            },
          })
          .expectNoErrors();
        createSpending = response.data.createSpending;
      });
      test("Then the response should be the created spending", () => {
        // console.table(createSpending);
        expect(createSpending).toMatchObject({
          value: spendingMock.value,
        });
      });
      test("Then the spending should have an id", async () => {
        expect(createSpending.id).toBeTruthy();
      });
      test("Then the spending should have an event", async () => {
        expect(createSpending.event.id).toBeTruthy();
      });
      test("Then the spending should have an user", async () => {
        expect(createSpending.buyer.id).toBeTruthy();
      });
      test("Then the spending should be in the database", async () => {
        const shoppingListItem = await integrationTestManager.dataSource
          .getRepository(Spending)
          .findOneByOrFail({ id: createSpending.id });
        expect(shoppingListItem).toBeDefined();
      });
    });
  });
});
