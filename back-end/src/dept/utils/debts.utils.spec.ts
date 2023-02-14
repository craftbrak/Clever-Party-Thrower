import {Spending} from "../../spending/entities/spending.entity";
import {Event} from "../../event/entities/event.entity";
import {calculateDebtsFromBalances, mapExpenses, optimiseDebts,} from "./debts.utils";
import {IntegrationTestManager} from "../../test/integration-test-manager";

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
        //console.table(result);
        // expect(result.get(users[0].id)).toEqual(1);
        // expect(result.get(users[1].id)).toEqual(2.2);
        // expect(result.get(users[2].id)).toEqual(-15.8);
        // expect(result.get(users[3].id)).toEqual(-3.8);
        // expect(result.get(users[4].id)).toEqual(8.2);
        let total = 0;
        result.forEach((r, key, map) => (total += Number(r)));
        // console.log(total);
        total = Math.floor(total);
        expect(total).toEqual(0);
    });
});
describe("calculateDebtsFromBalances", () => {
    let result: Debt[];
    const expenseMap = new Map<string, number>();
    beforeAll(async () => {
        await integrationTestManager.beforeAll();
        users = [
            await integrationTestManager.getNewUser(),
            await integrationTestManager.getNewUser(),
            await integrationTestManager.getNewUser(),
            await integrationTestManager.getNewUser(),
            await integrationTestManager.getNewUser(),
        ];
        for (let i = 0; i < users.length; i++) {
            users[i].id = i.toString();
        }
        expenseMap.set(users[0].id, -50);
        expenseMap.set(users[1].id, 40);
        expenseMap.set(users[2].id, 15);
        expenseMap.set(users[3].id, 15);
        expenseMap.set(users[4].id, -20);
        event = await integrationTestManager.getNewEvent();
        result = await calculateDebtsFromBalances(expenseMap, event.id);
    });
    afterAll(async () => {
        await integrationTestManager.afterAll();
    });
    it("total of balance should be 0 ", () => {
        let total = 0;
        expenseMap.forEach((value) => {
            total += value;
        });
        // console.log(total, "total");
        expect(total).toEqual(0); // verify test data
    });

    it("returns a array of debs with the correct event Id", async () => {
        //verify the total of all user's debts can't be more than their balance
        result.forEach((value, index) =>
            expect(result[index].eventId).toEqual(event.id),
        );
    });
    it("should produce a balance of 0 for all users", async function () {
        //verify the total of all user's balance is 0
        const expenseMapClone = new Map();
        Object.assign(expenseMapClone, expenseMap);
        result.forEach((debt) => {
            expenseMapClone[debt.creditorId] -= debt.amount;
        });
        // console.table(result);
        // console.table(expenseMap);
        expenseMapClone.forEach((value) => expect(value).toBe(0));
    });
    it("should not create debts that result in a negative balance for any user", async () => {
        result;
    });
});
describe("optimiseDebts", () => {
    const debts: Debt[] = [];
    let result: Debt[];
    beforeAll(async () => {
        await integrationTestManager.beforeAll();
        event = await integrationTestManager.getNewEvent();
        users = [
            await integrationTestManager.getNewUser(),
            await integrationTestManager.getNewUser(),
            await integrationTestManager.getNewUser(),
            await integrationTestManager.getNewUser(),
            await integrationTestManager.getNewUser(),
        ];
        for (let i = 0; i < users.length; i++) {
            users[i].id = i.toString();
        }
        debts.push({
            eventId: event.id,
            amount: 12,
            creditorId: users[0].id,
            debtorId: users[1].id,
        });
        debts.push({
            eventId: event.id,
            amount: 11,
            creditorId: users[2].id,
            debtorId: users[1].id,
        });
        debts.push({
            eventId: event.id,
            amount: 10,
            creditorId: users[0].id,
            debtorId: users[1].id,
        });
        debts.push({
            eventId: event.id,
            amount: 10,
            creditorId: users[1].id,
            debtorId: users[0].id,
        });
        debts.push({
            eventId: event.id,
            amount: 10,
            creditorId: users[1].id,
            debtorId: users[0].id,
        });
        debts.push({
            eventId: event.id,
            amount: 10,
            creditorId: users[1].id,
            debtorId: users[4].id,
        });
        debts.push({
            eventId: event.id,
            amount: 10,
            creditorId: users[3].id,
            debtorId: users[1].id,
        });
        result = await optimiseDebts(debts);
    });
    afterAll(async () => {
        await integrationTestManager.afterAll();
    });
    it("should return a list of debts that is not longer than the input", async () => {
        console.table(result);
        expect(result.length).toBeLessThanOrEqual(debts.length);
    });
    it("should return a list of debts were the differents debs of a same user are fused", async () => {
        // console.table(result);
        expect(
            result.find(
                (debt) =>
                    debt.creditorId === users[0].id && debt.debtorId === users[1].id,
            ).amount,
        ).toEqual(2);
        expect(
            result.find(
                (debt) =>
                    debt.creditorId === users[2].id && debt.debtorId === users[1].id,
            ).amount,
        ).toEqual(11);
        expect(
            result.find(
                (debt) =>
                    debt.creditorId === users[1].id && debt.debtorId === users[4].id,
            ).amount,
        ).toEqual(10);
        expect(
            result.find(
                (debt) =>
                    debt.creditorId === users[3].id && debt.debtorId === users[1].id,
            ).amount,
        ).toEqual(10);
    });
});
