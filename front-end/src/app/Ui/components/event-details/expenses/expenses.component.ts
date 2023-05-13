import {Component} from '@angular/core';
import {ExpensesService} from "../../../../services/expenses.service";
import {EventService} from "../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {

  protected readonly console = console;

  constructor(public sanitizer: DomSanitizer, public expensesService: ExpensesService, private eventService: EventService) {
    this.eventService.selectedEventId$.subscribe(value => expensesService.updateDebts(value!))
    this.eventService.selectedEventId$.subscribe(value => expensesService.updateExpenses(value!))
  }
}
