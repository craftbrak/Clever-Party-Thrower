import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {BehaviorSubject, map} from "rxjs";
import {DeptData, SpendingData} from "../../entities/gql-retun-types";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private debtsSource = new BehaviorSubject<DeptData | undefined>(undefined)
  debts$ = this.debtsSource.asObservable()
  private expenseSource = new BehaviorSubject<SpendingData[] | undefined>(undefined)
  expenses$ = this.expenseSource.asObservable()

  constructor(private apollo: Apollo) {
  }

  updateDebts(eventId: string) {
    const mut = gql`
      query Dept($eventId: ID!) {
        getEventDebts(eventId: $eventId) {
          id
          amount
          repayed
          debtor {
            avatar
            id
            name
          }
          creditor {
            id
            avatar
            name
          }
        }
      }`
    return this.apollo.watchQuery<DeptData>({
      query: mut,
      variables: {eventId: eventId},
      fetchPolicy: "no-cache"
    }).valueChanges
      .pipe(map(value => value.data)).subscribe(value => this.debtsSource.next(value))
  }

  updateExpenses(eventId: string) {
    const gql1 = gql`
      query Spendings($eventId: String) {
        spendings(eventId: $eventId) {
          id
          value
          buyer {
            id
            avatar
            name
          }
          shoppingListItem {
            id
            name
          }
          beneficiary {
            name
            id
            avatar
          }
        }
      }
    `
    return this.apollo.watchQuery<{ spendings: SpendingData[] }>({
      query: gql1,
      variables: {eventId: eventId},
      fetchPolicy: "no-cache"
    }).valueChanges.pipe(map(value => value.data.spendings)).subscribe(value => this.expenseSource.next(value))
  }

  addExpense(eventId: string, buyerId: string, value: number, beneficiaryId: string, name: string, shoppingListItemId?: string) {
    const mut = gql`mutation CreateSpending($createSpendingInput: CreateSpendingDto!) {
      createSpending(createSpendingInput: $createSpendingInput) {
        id
      }
    }`
    return this.apollo.mutate<{ id: string }>({
      mutation: mut, variables: {
        createSpendingInput: {
          buyerId: buyerId,
          beneficiaryId: beneficiaryId,
          name: name,
          eventId: eventId,
          value: value,
          shoppingListItemId: shoppingListItemId
        }
      }//@ts-ignore
    }).pipe(map(value1 => value1.data))
  }

  toggleDebt(id: string, value: boolean) {
    const mut = gql`
      mutation UpdateDept($updateDeptInput: UpdateDeptInput!) {
        updateDept(updateDeptInput: $updateDeptInput) {
          id
        }
      }
    `
    return this.apollo.mutate({
      mutation: mut,
      variables:
        {
          updateDeptInput: {
            id: id,
            repayed: value
          }
        }
    })
  }
}
