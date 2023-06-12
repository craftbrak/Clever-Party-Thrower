import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EventService} from "../../../../../services/event.service";
import {MemberData} from "../../members/members.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ShoppingList} from "../shoppinglist.component";

@Component({
  selector: 'app-add-shopping-item',
  templateUrl: './add-shopping-item.component.html',
  styleUrls: ['./add-shopping-item.component.scss']
})
export class AddShoppingItemComponent implements OnInit {

  shoppingListItem: ShoppingList | undefined
  shoppingForm: FormGroup | undefined;
  assignees: MemberData[] | undefined;
  eventId: string | null // populate this from the provided list
    | undefined // populate this from the provided list

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private eventService: EventService, public dialogRef: MatDialogRef<AddShoppingItemComponent>) {
    this.eventService.selectedEventId$.subscribe(eventId => {
      this.eventId = eventId
      eventService.getEventUsers(this.eventId!).subscribe(value => {
        this.assignees = value
      })
      this.shoppingListItem = this.data?.shoppingListItem
    })

  }

  ngOnInit() {
    this.shoppingListItem = this.data.shoppingListItem
    this.shoppingForm = this.fb.group({
      assignedId: [this.shoppingListItem ? this.shoppingListItem?.assigned.id : '', Validators.required],
      name: [this.shoppingListItem ? this.shoppingListItem?.name : '', Validators.required],
      price: [this.shoppingListItem ? this.shoppingListItem?.price : 0, Validators.required],
      bought: [this.shoppingListItem ? this.shoppingListItem?.bought : false],
    });
  }

  onSubmit() {
    if (!this.shoppingListItem) {
      this.eventService.addShoppingListItem(this.eventId!, this.shoppingForm?.value).subscribe(value => {
        this.dialogRef.close(value);
      })
    } else {
      this.eventService.updateShoppingListItem(this.shoppingListItem.id, this.eventId!, this.shoppingForm?.value).subscribe(value => {
        this.dialogRef.close(value);
      })
    }
  }

  delete() {
    if (this.shoppingListItem) {
      this.eventService.deleteShoppingListItem(this.shoppingListItem?.id).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
