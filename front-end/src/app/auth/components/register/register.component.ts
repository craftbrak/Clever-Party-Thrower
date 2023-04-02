import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../auth.service";
import {Country} from "../../../entities/address.entity";
import {AddressService} from "../../../services/address.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  isLinear = false;
  step1FormGroup: FormGroup
  step2FormGroup: FormGroup
  step3FormGroup: FormGroup
  step4FormGroup: FormGroup
  countries: Country[] = [];
  avatarUrls: string[] = ["https://api.dicebear.com/6.x/adventurer/svg?seed=Annie", "https://api.dicebear.com/6.x/adventurer/svg?seed=Baby"];

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private addressService: AddressService) {
    this.step1FormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.step2FormGroup = this.formBuilder.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.step3FormGroup = this.formBuilder.group({
      drivingLicence: [false],
      manual: [false]
    });

    this.step4FormGroup = this.formBuilder.group({
      avatar: ['', Validators.required]
    });
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
      console.table(this.countries)
    });
  }

  onSubmit() {
    if (this.step1FormGroup.valid && this.step2FormGroup.valid && this.step3FormGroup.valid && this.step4FormGroup.valid) {
      // Call the API to create a new address
      // this.authService.createAddress(this.step2FormGroup.value).subscribe((addressResponse: { addressId: string; }) => {
      //   // Extract the addressId from the response
      //   const addressId = addressResponse.addressId;
      //
      //   // Prepare the user data
      //   const userData = {
      //     ...this.step1FormGroup.value,
      //     addressId,
      //     drivingLicence: this.step3FormGroup.get('drivingLicence').value,
      //     manual: this.step3FormGroup.get('manual').value,
      //     avatar: this.step4FormGroup.get('avatar').value
      //   };
      //
      //   // Call the API to register the user
      //   this.authService.register(userData).subscribe(registerResponse => {
      //     // Handle registration success
      //   }, error => {
      //     // Handle registration error
      //   });
      // }, error => {
      //   // Handle address creation error
      // });

      // this.addressService.createAddress(this.step2FormGroup.value).subscribe(
      //   (addressResponse) => {
      //     // Handle address creation success
      //   },
      //   (error) => {
      //     // Handle address creation error
      //   }
      // );
    }
  }
}
