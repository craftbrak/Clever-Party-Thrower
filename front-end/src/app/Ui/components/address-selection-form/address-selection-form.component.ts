import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Address} from "../../../entities/address.entity";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-address-selection-form',
  templateUrl: './address-selection-form.component.html',
  styleUrls: ['./address-selection-form.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({height: 0, opacity: 0}),
        animate('0.3s ease-in-out', style({height: '*', opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.3s ease-in-out', style({height: 0, opacity: 0}))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* <=> *', [
        query(':enter, :leave', [
          stagger(300, [
            animate('0.3s', style({height: 0, opacity: 0}))
          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class AddressSelectionFormComponent implements OnInit {
  @Input() addresses: Address[] = [];
  @Output() valid = new EventEmitter<boolean>();
  @Output() selectedAddress = new EventEmitter<string>();
  @Output() addNewAddress = new EventEmitter<void>();

  addressSelectionForm: FormGroup;
  selectedAddressId: string = '';
  showAddAddressForm = false;


  constructor(private fb: FormBuilder) {
    this.addressSelectionForm = this.fb.group({
      addressId: ['', Validators.required],
    });

    this.addressSelectionForm.valueChanges.subscribe((value) => {
      this.valid.emit(this.addressSelectionForm.valid);
      this.selectedAddress.emit(value.addressId);
    });
  }

  ngOnInit() {
    if (this.addresses.length > 0) {
      this.selectedAddressId = this.addresses[0].id;
      this.addressSelectionForm.patchValue({addressId: this.selectedAddressId});
    }
  }

  onCardClick(addressId: string) {
    this.selectedAddressId = addressId;
    this.addressSelectionForm.patchValue({addressId: this.selectedAddressId});
  }

  toggleAddAddressForm(): void {
    this.showAddAddressForm = !this.showAddAddressForm;
  }

  onAddNewAddressClick() {
    this.selectedAddressId = '';
    this.addressSelectionForm.patchValue({addressId: ''}, {emitEvent: false});
    this.valid.emit(false);
    this.addNewAddress.emit();
  }

  onAddressFormSubmit(data: any): void {
    // Handle address form submission
  }

  onAddressFormValidity(valid: boolean): void {
    // Handle address form validity
  }
}
