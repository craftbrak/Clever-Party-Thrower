import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterUserFormComponent} from "./register-user-form/register-user-form.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {UserInfoFormComponent} from "./forms/user-info-form/user-info-form.component";
import {AddressFormComponent} from "./forms/address-form/address-form.component";
import {AvatarFormComponent} from "./forms/avatar-form/avatar-form.component";
import {ConfirmationFormComponent} from "./forms/confirmation-form/confirmation-form.component";
import {DrivingLicenceFormComponent} from "./forms/driving-licence-form/driving-licence-form.component";
import {MatStepperModule} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatPasswordStrengthModule} from "@angular-material-extensions/password-strength";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatNativeDateModule} from "@angular/material/core";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    RegisterUserFormComponent,
    RegisterComponent,
    LoginComponent,
    UserInfoFormComponent,
    AddressFormComponent,
    AvatarFormComponent,
    ConfirmationFormComponent,
    DrivingLicenceFormComponent,
  ],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatPasswordStrengthModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    RouterModule
  ]
})
export class UiComponentsModule {
}
