import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EventService} from "../../../services/event.service";
import {Address} from "../../../entities/address.entity";
import {AddressService} from "../../../services/address.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  eventInfoValid = false;
  addressValid = false;
  datesValid = false;
  eventInfoData: any;
  addressData: any;
  datesData: any;
  isLinear: boolean = false;
  existingAddresses: Address[] = []

  constructor(private addressService: AddressService, private eventService: EventService, private router: Router, public dialogRef: MatDialogRef<EventFormComponent>) {
    dialogRef.disableClose = false;
  }

  ngOnInit(): void {
    this.eventService.testBackEnd()
    this.addressService.getAddresses().subscribe(value => {
      console.table(value.data.addresses)
      this.existingAddresses = value.data.addresses
    })
  }

  onEventInfoFormValidity(valid: boolean): void {
    this.eventInfoValid = valid;
  }

  onAddressFormValidity(valid: boolean): void {
    this.addressValid = valid;
  }

  onDateSelectionFormValidity(valid: boolean): void {
    this.datesValid = valid;
  }

  onEventInfoFormSubmit(data: any): void {
    this.eventInfoData = data;
    console.table(data)
  }

  onAddressFormSubmit(data: any): void {
    this.addressData = data;
  }

  onDateSelectionFormSubmit(data: any): void {
    console.table(data)
    this.datesData = data;
  }

  onSubmit(): void {
    console.warn("submitted")
    console.log(this.eventInfoData);
    console.log(this.addressData);
    console.log(this.datesData);

    if (this.eventInfoValid && this.addressValid && this.datesValid) {
      // Process the event creation data and submit it.
      // const eventData = {
      //   ...this.eventInfoData,
      //   addressId: this.addressData.id,
      //   fixedDate: this.datesData.length === 1,
      //   multipleDates: this.datesData,
      //   userId: localStorage.getItem("userId")
      // };
      console.log('setup eventData')
      console.table(this.eventInfoData)
      console.table(this.addressData)
      console.table(this.datesData)
      const eventData = {
        name: this.eventInfoData.eventName,
        description: this.eventInfoData.eventDescription,
        total: 0,
        addressId: this.addressData.id,
        fixedDate: this.datesData.length === 1,
      }
      const eventToUserData = {
        userId: localStorage.getItem("userid"),
        addressId: this.addressData.id,
      }
      const eventDateData = this.datesData
      this.eventService.createEventAndRelatedData(eventData, eventToUserData, eventDateData)
        .subscribe((next) => {
          this.dialogRef.close('submit');
        })

    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
