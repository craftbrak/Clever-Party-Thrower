import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AddressService} from "../../../../services/address.service";
import {Country} from "../../../../entities/address.entity";

@Component({
  selector: 'app-confirmation-form',
  templateUrl: './confirmation-form.component.html',
  styleUrls: ['./confirmation-form.component.scss']
})
export class ConfirmationFormComponent implements OnInit {
  @Input() userData: any = {};
  @Input() addressData: any = {};
  @Input() licenceData: any = {};
  @Input() avatarData: any = {};

  @Input() userInfoValid = false;
  @Input() addressValid = false;
  @Input() drivingLicenceValid = false;
  @Input() avatarValid = false;


  @Output() submitForm = new EventEmitter<void>();

  countries: Country[] = []

  constructor(private addressService: AddressService) {
  }

  ngOnInit(): void {
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
    })
  }

  getCountryName(id: string) {
    return this.countries.find(country => country.id === id)
  }

  onSubmit(): void {
    this.submitForm.emit();
  }
}
