import {Component, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatDatepickerInput} from "@angular/material/datepicker";

@Component({
  selector: 'app-add-date-dialog',
  templateUrl: './add-date-dialog.component.html',
  styleUrls: ['./add-date-dialog.component.scss']
})
export class AddDateDialogComponent {

  @ViewChild(MatDatepickerInput) datepickerInput: MatDatepickerInput<Date> | undefined;

  constructor(public dialogRef: MatDialogRef<AddDateDialogComponent>) {
  }

  onSubmit(): void {
    this.dialogRef.close(this.datepickerInput?.value);
  }

}
