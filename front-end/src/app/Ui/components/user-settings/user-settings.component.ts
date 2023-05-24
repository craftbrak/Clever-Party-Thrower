import {Component, Inject, SecurityContext} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {AuthService} from "../../../auth/auth.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        opacity: 1,
      })),
      state('closed', style({
        height: '*',
        opacity: 0.5,
        backgroundColor: 'green'
      })),
      transition('open => closed', [
        animate('1s ease-in-out')
      ]),
      transition('closed => open', [
        animate('0.5s ease-in-out')
      ]),
    ]),
  ],
})
export class UserSettingsComponent {
  activeForm: string | null = null;
  isOpened = false;
  userInfoValid = false;
  userInfoData: any;
  addressValid = false;
  addressData: any;
  drivingLicenceValid = false;
  drivingLicenceData: any;
  avatarValid = false;
  avatarData: string = '';

  constructor(
    public dialogRef: MatDialogRef<UserSettingsComponent>,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(authService.user)
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    console.log(this.userInfoData)
    switch (this.activeForm) {
      case "user":
        this.authService.updateUser({
          id: this.authService.user?.id!,
          name: this.userInfoData.name,
          email: this.userInfoData.email,
          password: this.userInfoData.password
        }).subscribe(value => {
          this.onCloseClick()
          this.authService.refreshTokens()
          if (this.userInfoData.password) {
            this.authService.logout()
          }
        })
        break
      case "address":
        this.authService.updateUser({
          id: this.authService.user?.id!,
          addressId: this.addressData.addressId
        }).subscribe(value => {
          this.authService.refreshTokens()
          this.onCloseClick()
        })
        break
      case "avatar":
        this.authService.updateUser({
          id: this.authService.user?.id!,
          avatar: this.sanitizer.sanitize(SecurityContext.URL, this.avatarData)!
        }).subscribe(value => {
          this.onCloseClick()
          this.authService.refreshTokens()
        })
        break
      case "licence":
        this.authService.updateUser({
          id: this.authService.user?.id!,
          dirivinglicence: this.drivingLicenceData.dirivinglicence,
          manual: this.drivingLicenceData.manual
        }).subscribe(value => {
          this.onCloseClick()
          this.authService.refreshTokens()
        })
    }
    // Implement your logic for confirming the form input
  }

  onCloseClick(): void {
    this.activeForm = null; // This will close the currently active form
    this.isOpened = false;
  }

  onDeleteClick(): void {
    // Add confirmation dialog and deletion logic here
  }

  onDownloadClick(): void {
    // Add download logic here
  }

  openForm(form: string): void {
    this.activeForm = form;
    this.isOpened = true; // This will trigger the 'open' animation
  }

  onUserInfoFormValidity(valid: boolean): void {
    this.userInfoValid = valid;
    console.log(`${this.userInfoValid} uservalid`)
  }

  onAddressFormValidity(valid: boolean): void {
    this.addressValid = valid;
    console.log(`${this.addressValid} addressValid`)
  }

  onDrivingLicenceFormValidity(valid: boolean): void {
    this.drivingLicenceValid = valid;
    console.log(`${this.drivingLicenceValid} drivingLicenceValid`)
  }

  onAvatarFormValidity(valid: boolean): void {
    this.avatarValid = valid;
    console.log(`${this.avatarValid} avatarValid`)
  }

  onUserInfoFormSubmit(data: any): void {
    this.userInfoData = data;
    console.table(data)
  }

  onAddressFormSubmit(data: any): void {
    this.addressData = data;
    console.log(`${this.addressData} addressData`)

  }

  onDrivingLicenceFormSubmit(data: any): void {
    this.drivingLicenceData = data;
    console.log(`${this.drivingLicenceData} drivingLicenceData`)

  }

  onAvatarFormSubmit(data: any): void {
    this.avatarData = data;
    console.log(`${this.avatarData} avatarData`)
  }

}
