import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EventService} from "../../../../../services/event.service";
import {MemberData} from "../../members/members.component";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-shopping-item',
  templateUrl: './add-shopping-item.component.html',
  styleUrls: ['./add-shopping-item.component.scss']
})
export class AddShoppingItemComponent implements OnInit {

  shoppingForm: FormGroup | undefined;
  assignees: MemberData[] | undefined;
  eventId: string | null // populate this from the provided list
    | undefined // populate this from the provided list

  constructor(private fb: FormBuilder, private eventService: EventService, public dialogRef: MatDialogRef<AddShoppingItemComponent>) {
    this.eventService.selectedEventId$.subscribe(eventId => {
      this.eventId = eventId
      eventService.getEventUsers(this.eventId!).subscribe(value => {
        this.assignees = value
      })
    })

  }

  ngOnInit() {
    this.shoppingForm = this.fb.group({
      assignedId: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, Validators.required],
      bought: [false],
    });
  }

  onSubmit() {
    this.eventService.addShoppingListItem(this.eventId!, this.shoppingForm?.value).subscribe(value => {
      this.dialogRef.close(value);
    })
  }

}
