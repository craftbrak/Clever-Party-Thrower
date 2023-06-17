import {ChangeDetectorRef, Component} from '@angular/core';
import {ExpensesService} from "../../../../services/expenses.service";
import {EventService} from "../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {EventDebts} from "../../../../../entities/gql-retun-types";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";
import {AddExpenseFormComponent} from "./add-expense-form/add-expense-form.component";

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  animations: [
    trigger('expandFromTop', [
      state('hidden', style({opacity: 0, transform: 'translateY(-100%)'})),
      state('visible', style({opacity: 1, transform: 'translateY(0)'})),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out'))
    ])
  ]
})
export class ExpensesComponent {

  eventId: string | undefined
  // debts$: Observable<DeptData> | undefined
  // expenses$: Observable<SpendingData[]> | undefined
  // private debtRefreshTrigger: Subject<void>;
  // private expenseRefreshTrigger: Subject<void>;
  showExpenses = false
  animationState: 'hidden' | 'visible' = 'hidden';

  constructor(private dialog: MatDialog, public sanitizer: DomSanitizer, public expensesService: ExpensesService, private eventService: EventService, private cdRef: ChangeDetectorRef) {
    // this.debtRefreshTrigger = new Subject<void>();
    // this.expenseRefreshTrigger = new Subject<void>();
    this.eventService.selectedEventId$.subscribe(value => {
      this.expensesService.updateExpenses(value!)
      this.expensesService.updateDebts(value!)
      // this.debts$ = this.debtRefreshTrigger.pipe(
      //   startWith(null),
      //   switchMap(() => {
      //     return this.expensesService.updateDebts(value!)
      //   })
      // )
      // this.expenses$ = this.expenseRefreshTrigger.pipe(
      //   startWith(null),
      //   switchMap(() => {
      //     return this.expensesService.updateExpenses(value!)
      //   })
      // )
      this.eventId = value!
    })
    this.expensesService.expenses$.subscribe(value => {
      this.cdRef.detectChanges()
      this.showExpenses = false
    })
  }

  toggleDebt(id: string, value: boolean, debt: EventDebts) {
    this.expensesService.toggleDebt(id, value).subscribe(() => {
      this.addExpense("Refund", debt.debtor.id, debt.creditor.id, this.eventId!, debt.amount)
    })
  }

  addExpense(name: string, beneficiaryId: string, buyer: string, eventId: string, value: number) {
    this.expensesService.addExpense(eventId, buyer, value, beneficiaryId, name).subscribe(() => {
      this.expensesService.updateExpenses(this.eventId!)
      this.expensesService.updateDebts(this.eventId!)
    })
  }

  toggleExpenses() {
    this.showExpenses = !this.showExpenses
    this.toggleAnimation()
  }

  toggleAnimation() {
    this.animationState = this.animationState === 'hidden' ? 'visible' : 'hidden';
  }

  openAddExpenseForm() {
    const dialogRef = this.dialog.open(AddExpenseFormComponent, {})
    dialogRef.afterClosed().subscribe((resultKeyNameFromField: {
      name: string,
      buyerId: string,
      beneficiaryId: string,
      amount: number
    }) => {
      if (resultKeyNameFromField) {
        this.expensesService.addExpense(this.eventId!, resultKeyNameFromField.buyerId, resultKeyNameFromField.amount, resultKeyNameFromField.beneficiaryId, resultKeyNameFromField.name, undefined).subscribe(value => {
          this.expensesService.updateExpenses(this.eventId!)
          this.expensesService.updateDebts(this.eventId!)
        })
      }
    })
  }
}
