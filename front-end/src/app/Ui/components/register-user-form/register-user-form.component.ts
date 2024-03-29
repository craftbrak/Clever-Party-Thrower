import {Component, OnInit, SecurityContext} from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AddressService} from "../../../services/address.service";
import {CreateAddressDto} from "../../../Dto/create-address.dto";
import {DomSanitizer} from "@angular/platform-browser";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user-form.component.html',
  styleUrls: ['./register-user-form.component.scss']
})
export class RegisterUserFormComponent implements OnInit {
  userInfoValid = false;
  addressValid = false;
  drivingLicenceValid = false;
  avatarValid = false;
  userInfoData: any;
  addressData: any;
  drivingLicenceData: any;
  avatarData: string = '';

  isLinear: boolean = false;
  userName: string = ''
  private eventId: string | null | undefined;

  constructor(private authService: AuthService,
              private router: Router,
              private addressService: AddressService,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private eventService: EventService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId');
    });
  }


  onUserInfoFormValidity(valid: boolean): void {
    this.userInfoValid = valid;
  }

  onAddressFormValidity(valid: boolean): void {
    this.addressValid = valid;
  }

  onDrivingLicenceFormValidity(valid: boolean): void {
    this.drivingLicenceValid = valid;
  }

  onAvatarFormValidity(valid: boolean): void {
    this.avatarValid = valid;
  }

  onUserInfoFormSubmit(data: any): void {
    this.userInfoData = data;
    console.table(data)
  }

  onAddressFormSubmit(data: any): void {
    this.addressData = data;
  }

  onDrivingLicenceFormSubmit(data: any): void {
    this.drivingLicenceData = data;
  }

  onAvatarFormSubmit(data: any): void {
    this.avatarData = data;
  }

  onUserNameUpdate(name: string) {
    this.userName = name;
  }

  onSubmit(): void {
    // Process the registration data and submit it.
    console.warn("submited")
    console.log(this.userInfoData);
    console.log(this.addressData);
    console.log(this.drivingLicenceData);
    console.log(this.avatarData);

    if (this.userInfoValid && this.addressValid && this.drivingLicenceValid && this.avatarValid) {
      // Call the API to create a new address
      let addressId: string = "";
      console.log('creating Address');
      const addressDTO: CreateAddressDto = {
        city: this.addressData.city,
        countryId: this.addressData.countryId,
        line1: this.addressData.line1,
        postalCode: this.addressData.postalCode,
        unitNumber: this.addressData.unitNumber

      }
      this.addressService.createAddress(addressDTO).subscribe(
        //@ts-ignore
        (data) => {
          // Handle address creation success
          addressId = data.id;
          const userData = {
            ...this.userInfoData,
            addressId: addressId,
            drivingLicence: this.drivingLicenceData?.drivingLicence,
            manual: this.drivingLicenceData?.manual,
            avatar: this.sanitizer.sanitize(SecurityContext.URL, this.avatarData)
          };
          this.registerUser(userData.name, userData.email, userData.password, userData.addressId, userData.drivingLicence, userData.manual, userData.avatar)
        },
        (error) => {
          console.error('Address creation error:', error);
        }
      );
    }
  }

  private registerUser(name: string, email: string, password: string, addressId: string, licence: boolean, manual: boolean, avatar: string) {
    console.log("Creating User")
    this.authService.register(name, email, password, licence, manual, addressId, avatar).subscribe(reps => {
      this.authService.login(email, password).subscribe(resp => {
        if (resp) {
          if (this.eventId) {
            this.eventService.addEventToUser(this.eventId, this.authService.user?.id!).subscribe(value => {
              this.router.navigate(['/dashboard'])
            })
          } else this.router.navigate(['/dashboard'])
        }
      })
    }, error => {
      console.error('Registering error:', error);
    })
  }
}

