import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EventService} from "../../../services/event.service";
import {Address} from "../../../entities/address.entity";
import {AddressService} from "../../../services/address.service";

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

  constructor(private addressService: AddressService, private eventService: EventService, private router: Router) {
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
    this.datesData = data;
  }

  onSubmit(): void {
    console.warn("submitted")
    console.log(this.eventInfoData);
    console.log(this.addressData);
    console.log(this.datesData);

    if (this.eventInfoValid && this.addressValid && this.datesValid) {
      // Process the event creation data and submit it.
      const eventData = {
        ...this.eventInfoData,
        addressId: this.addressData.addressId,
        fixedDate: this.datesData.fixedDate,
        multipleDates: this.datesData.multipleDates
      };
      this.createEvent(eventData);
    }
  }

  private createEvent(eventData: any) {
    console.log("Creating Event");
    this.eventService.createEvent(eventData).subscribe(
      (response) => {
        console.log('Event creation success:', response);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Event creation error:', error);
      }
    );
  }
}
