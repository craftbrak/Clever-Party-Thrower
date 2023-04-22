import { Spending } from "../../spending/entities/spending.entity";
import { Event } from "../../event/entities/event.entity";
import { UserEntity } from "../../user/entities/user.entity";

/**
 * this function takes a list of spending and a list of participant and calculates each participant's balance
 * It spread the cost of all expenses to all participants
 * @param expenses
 * @param participants
 * @return the map of balances
 */
export async function mapExpenses(
  expenses: Spending[],
  participants: UserEntity[],
): Promise<Map<UserEntity["id"], number>> {
  const pMap = new Map<UserEntity["id"], number>();
  expenses.forEach((expense) => {
    const share = expense.value / participants.length;
    participants.forEach((participant) => {
      if (!pMap.has(participant.id)) {
        pMap.set(participant.id, 0);
      }
      if (!pMap.has(expense.buyer.id)) {
        pMap.set(expense.buyer.id, 0);
      }
      // if (participant.id !== expense.buyer.id) {
      //
      // }
      pMap.set(participant.id, pMap.get(participant.id) + share);
      pMap.set(expense.buyer.id, pMap.get(expense.buyer.id) - share);
    });
  });
  // pMap.forEach((value, key, map) =>
  //   pMap.set(key, Number((Math.round(pMap.get(key) * 100) / 100).toFixed(2))),
  // );
  return pMap;
}

/**
 * This function uses a map of user and number representing eatch uses balance to calculate all the debts of eatch user
 * @param balances the map
 * @param eventId the event on with the debts will be linked
 * @return list of debts returning all balances to 0
 */
export async function calculateDebtsFromBalances(
  balances: Map<string, number>,
  eventId: string,
): Promise<Debt[]> {
  const debts: Debt[] = [];
  balances.forEach((balance, userId) => {
    if (balance > 0) {
      // trouver un autre utilisateur avec un solde négatif
      let found = false;
      balances.forEach((otherBalance, otherUserId) => {
        if (!found && otherBalance < 0 && userId !== otherUserId) {
          const debtAmount = Math.min(balance, -otherBalance);
          balances.set(userId, balance - debtAmount);
          balance -= debtAmount;
          balances.set(otherUserId, otherBalance + debtAmount);
          const debt: Debt = {
            amount: debtAmount,
            creditorId: userId,
            debtorId: otherUserId,
            eventId: eventId,
          };

          debts.push(debt);
          if (balance === debtAmount) {
            found = true;
          }
        }
      });
    }
  });
  return debts;
}

/**
 * This function has for objective to reduce the number of debts by fusionning debts between the same users
 * @param debts A list of debts that has to be minimised
 */
export async function optimiseDebts(debts: Debt[]): Promise<Debt[]> {
  const optimisedDebts: Debt[] = [];
  const exploredUser = new Map<UserEntity["id"], UserEntity["id"]>();
  for (const debt of debts) {
    const currentCreditor = debt.creditorId;
    const currentDebtor = debt.debtorId;
    if (
      (exploredUser.has(currentCreditor) &&
        exploredUser.get(currentCreditor) === currentDebtor) ||
      (exploredUser.has(currentDebtor) &&
        exploredUser.get(currentDebtor) === currentCreditor)
    ) {
      continue;
    }
    exploredUser.set(currentCreditor, currentDebtor);
    const optimisedDept: Debt = {
      creditorId: currentCreditor,
      debtorId: currentDebtor,
      eventId: debt.eventId,
      amount: 0,
    };
    const filteredDebts = debts.filter(
      (det) =>
        det.debtorId === currentDebtor && det.creditorId === currentCreditor,
    );
    for (const fdebt of filteredDebts) {
      optimisedDept.amount += fdebt.amount;
    }
    const fDebts = debts.filter(
      (det) =>
        det.debtorId === currentCreditor && det.creditorId === currentDebtor,
    );
    for (const fDebt of fDebts) {
      optimisedDept.amount -= fDebt.amount;
    }

    if (optimisedDept.amount > 0) {
      optimisedDebts.push(optimisedDept);
    }
    if (optimisedDept.amount < 0) {
      optimisedDept.debtorId = currentCreditor;
      optimisedDept.creditorId = currentDebtor;
      optimisedDept.amount = Math.abs(optimisedDept.amount);
      optimisedDebts.push(optimisedDept);
    }
  }
  return optimisedDebts;
}
