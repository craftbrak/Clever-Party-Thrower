import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Country} from "../../../../entities/address.entity";
import {AddressService} from "../../../../services/address.service";

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  @Output() valid = new EventEmitter<boolean>();
  @Output() address = new EventEmitter<any>();

  addressForm: FormGroup;


  countries: Country[] = [];

  constructor(private formBuilder: FormBuilder, private addressService: AddressService) {
    this.addressForm = this.formBuilder.group({
      unitNumber: [''],
      line1: ['', Validators.required],
      city: ['', Validators.required],
      countryId: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.addressForm.statusChanges.subscribe(status => {
      this.valid.emit(status === 'VALID');
      if (status === 'VALID') {
        this.address.emit(this.addressForm.value)
      }
    });
    this.addressService.getCountries().subscribe(({data}) => {
      this.countries = [...data.countries].sort((country1, contry3) => {
        if (country1.name > contry3.name) {
          return 1;
        }
        if (country1.name < contry3.name) {
          return -1;
        }
        return 0;
      });
      // console.table(this.countries)
    });
    // this.addressForm.valueChanges.pipe(debounceTime(450)).subscribe(value => this.address.emit(value))
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      this.address.emit(this.addressForm.value);
    }
  }
}
