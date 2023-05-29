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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {EventFormComponent} from './event-form/event-form.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {EventInfoFormComponent} from './forms/event-info-form/event-info-form.component';
import {AddressSelectionFormComponent} from './forms/address-selection-form/address-selection-form.component';
import {DateSelectionFormComponent} from './forms/date-selection-form/date-selection-form.component';
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {AddressCardComponent} from './address-card/address-card.component';
import {EventInfoComponent} from './event-info/event-info.component';
import {EventDetailsComponent} from './event-details/event-details.component';
import {MembersComponent} from './event-details/members/members.component';
import {ShoppinglistComponent} from './event-details/shoppinglist/shoppinglist.component';
import {CarpoolComponent} from './event-details/carpool/carpool.component';
import {ExpensesComponent} from './event-details/expenses/expenses.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {DateSelectionComponent} from './event-details/date-selection/date-selection.component';
import {MemberComponent} from './event-details/members/member/member.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {AddDateDialogComponent} from './event-details/date-selection/add-date-dialog/add-date-dialog.component';
import {AddShoppingItemComponent} from './event-details/shoppinglist/add-shopping-item/add-shopping-item.component';
import {
  AddEventToUserLinkDialogComponent
} from './event-details/members/add-event-to-user-link-dialog/add-event-to-user-link-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ToastComponent} from './toast/toast.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {CreateCarFormComponent} from "./event-details/carpool/create-car-form/create-car-form.component";
import {MatSliderModule} from "@angular/material/slider";
import {CreateCarPoolFormComponent} from './event-details/carpool/create-car-pool-form/create-car-pool-form.component';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import {BrowserModule} from "@angular/platform-browser";
import {AddExpenseFormComponent} from './event-details/expenses/add-expense-form/add-expense-form.component';
import {ExpenseTreeComponent} from './event-details/expenses/expense-tree/expense-tree.component';
import {VerifyEmailComponent} from './verify-email/verify-email.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {RequestPasswordResetComponent} from './request-password-reset/request-password-reset.component';


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
    EventFormComponent,
    EventInfoFormComponent,
    AddressSelectionFormComponent,
    DateSelectionFormComponent,
    AddressCardComponent,
    EventInfoComponent,
    EventDetailsComponent,
    MembersComponent,
    ShoppinglistComponent,
    CarpoolComponent,
    ExpensesComponent,
    DateSelectionComponent,
    MemberComponent,
    AddDateDialogComponent,
    AddShoppingItemComponent,
    AddEventToUserLinkDialogComponent,
    ToastComponent,
    CreateCarFormComponent,
    CreateCarPoolFormComponent,
    UserSettingsComponent,
    AddExpenseFormComponent,
    ExpenseTreeComponent,
    VerifyEmailComponent,
    ResetPasswordComponent,
    RequestPasswordResetComponent,
  ],
  exports: [
    EventFormComponent,
    EventInfoComponent,
    EventDetailsComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatPasswordStrengthModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    RouterModule,
    MatStepperModule,
    MatCheckboxModule,
    FormsModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSliderModule
  ]
})
export class UiComponentsModule {
}
