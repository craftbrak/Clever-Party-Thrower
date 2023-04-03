import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard} from "./auth.guard";
import {AuthService} from "./auth.service";
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterComponent} from './components/register/register.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RouterModule} from "@angular/router";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatStepperModule} from "@angular/material/stepper";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {PasswordMatchDirective} from './password-match.directive';
import {MatPasswordStrengthModule} from "@angular-material-extensions/password-strength";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PasswordMatchDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    RouterModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatRadioModule,
    MatSelectModule,
    MatPasswordStrengthModule
  ],
  providers: [
    AuthGuard,
    AuthService,
  ]
})
export class AuthModule {
}
