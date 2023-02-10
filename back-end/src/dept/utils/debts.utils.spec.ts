import { Spending } from "../../spending/entities/spending.entity";
import { Event } from "../../event/entities/event.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { userMock, userMock1 } from "../../test/mock/user.mock";
import { EventMock } from "../../test/mock/event.mock";
import { mapExpenses } from "./debts.utils";
import { IntegrationTestManager } from "../../test/integration-test-manager";
jest.setTimeout(90000);
const integrationTestManager = new IntegrationTestManager();
let users = [];
let event: Event;
describe("mapExpenses", () => {
  let expenses: Spending[] = [];
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
    users = [
      await integrationTestManager.getNewUser(),
      await integrationTestManager.getNewUser(),
      await integrationTestManager.getNewUser(),
      await integrationTestManager.getNewUser(),
      await integrationTestManager.getNewUser(),
    ];
    expenses = [
      await integrationTestManager.getNewSpending(event, users[0], 1),
      await integrationTestManager.getNewSpending(event, users[1], 5),
      await integrationTestManager.getNewSpending(event, users[2], 5),
      await integrationTestManager.getNewSpending(event, users[2], 5),
      await integrationTestManager.getNewSpending(event, users[2], 5),
      await integrationTestManager.getNewSpending(event, users[2], 5),
      await integrationTestManager.getNewSpending(event, users[3], 10),
      await integrationTestManager.getNewSpending(event, users[0], 5),
    ];
    event = await integrationTestManager.getNewEvent();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  it("maps expenses to participants correctly", async () => {
    const result = await mapExpenses(expenses, users);
    // console.table(users);
    // console.dir(expenses);
    console.table(result);
    // expect(result.get(users[0].id)).toEqual(1);
    // expect(result.get(users[1].id)).toEqual(2.2);
    // expect(result.get(users[2].id)).toEqual(-15.8);
    // expect(result.get(users[3].id)).toEqual(-3.8);
    // expect(result.get(users[4].id)).toEqual(8.2);
    let total = 0;
    result.forEach((r, key, map) => (total += Number(r)));
    console.log(total);
    total = Math.floor(total);
    let q = 2.2 + 3.2 + 8.2 - 11.8 - 1.8;
    console.log(q);
    expect(total).toEqual(0);
  });
});
describe("calculateDebtsFromBalances", () => {
  const expenseMap = new Map<string, number>();
  expenseMap.set(users[1], 5);
  expenseMap.set(users[0], -5);
});
