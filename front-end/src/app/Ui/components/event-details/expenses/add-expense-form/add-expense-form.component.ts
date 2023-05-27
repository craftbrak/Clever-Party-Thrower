import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberData} from "../../members/members.component";
import {EventService} from "../../../../../services/event.service";
import {UserRole} from "../../../../../entities/event-to-user.entity";

@Component({
  selector: 'app-add-expense-form',
  templateUrl: './add-expense-form.component.html',
  styleUrls: ['./add-expense-form.component.scss']
})
export class AddExpenseFormComponent {
  expenseForm: FormGroup
  users: MemberData[] = []

  constructor(
    private dialogRef: MatDialogRef<AddExpenseFormComponent>,
    private fb: FormBuilder,
    private eventService: EventService,
  ) {
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      buyerId: ['', Validators.required],
      beneficiaryId: ['', Validators.required],
      amount: ['', Validators.required]
    })
    this.eventService.selectedEventId$.subscribe(eventId => {
      eventService.getEventUsers(eventId!).subscribe(value => {
        this.users = value.filter(value1 => value1.role !== UserRole.INVITED && value1.role !== UserRole.NOT_ATTENDING)
      })
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (this.expenseForm.valid) {
      // Pass the form value to the dialog close method
      this.dialogRef.close(this.expenseForm.value);
    }
  }


}
