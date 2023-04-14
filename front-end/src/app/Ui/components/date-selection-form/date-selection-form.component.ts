import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-date-selection-form',
  templateUrl: './date-selection-form.component.html',
  styleUrls: ['./date-selection-form.component.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      state('in', style({opacity: 1, transform: 'translateX(0)'})),
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(100%)'}),
        animate('200ms ease-in'),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({opacity: 0, transform: 'translateX(100%)'})),
      ]),
    ]),
  ],
})
export class DateSelectionFormComponent implements OnInit {
  @Output() dates: EventEmitter<Date[]> = new EventEmitter();
  @Output() valid: EventEmitter<boolean> = new EventEmitter();
  // todo: fix validation
  dateForm: FormGroup;
  selectedDates: Date[] = [];

  constructor(private fb: FormBuilder) {
    this.dateForm = this.fb.group({
      isMultipleDates: [false],
      date: [null, Validators.required],
    });
  }

  get multipledate() {
    return this.dateForm.get("isMultipleDates")?.value
  }

  ngOnInit(): void {
    this.dateForm.valueChanges.subscribe(() => {
      this.valid.emit(this.isvalid());
    });
  }

  addDate() {
    if (this.dateForm.valid) {
      this.selectedDates.push(this.dateForm.get('date')?.value);
      this.dates.emit(this.selectedDates);
      this.dateForm.get('date')?.reset();
    }
  }

  removeDate(index: number) {
    this.selectedDates.splice(index, 1);
    this.dates.emit(this.selectedDates);
  }

  isvalid(): boolean {
    return this.dateForm.valid || (this.selectedDates.length > 0 || !this.dateForm.get('isMultipleDates')?.value)
  }
}
