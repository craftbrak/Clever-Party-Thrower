import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-date-selection-form',
  templateUrl: './date-selection-form.component.html',
  styleUrls: ['./date-selection-form.component.scss']
})
export class DateSelectionFormComponent {
  dateSelectionForm: FormGroup;
  fixedDate: boolean;

  @Output() valid = new EventEmitter<boolean>();
  @Output() dates = new EventEmitter<{ fixedDate: boolean, date: Date, multipleDates: Date[] }>();

  constructor(private fb: FormBuilder) {
    this.fixedDate = true;
    this.dateSelectionForm = this.fb.group({
      singleDate: ['', Validators.required],
      multipleDates: [''],
    });

    this.dateSelectionForm.valueChanges.subscribe((value) => {
      this.valid.emit(this.dateSelectionForm.valid);
      this.dates.emit({fixedDate: this.fixedDate, date: value.singleDate, multipleDates: value.multipleDates});
    });
  }

  onFixedDateChange(fixedDate: boolean): void {
    this.fixedDate = fixedDate;
    if (fixedDate) {
      this.dateSelectionForm.get('singleDate')?.setValidators(Validators.required);
      this.dateSelectionForm.get('multipleDates')?.clearValidators();
    } else {
      this.dateSelectionForm.get('multipleDates')?.setValidators(Validators.required);
      this.dateSelectionForm.get('singleDate')?.clearValidators();
    }
    this.dateSelectionForm.get('singleDate')?.updateValueAndValidity();
    this.dateSelectionForm.get('multipleDates')?.updateValueAndValidity();
  }
}
