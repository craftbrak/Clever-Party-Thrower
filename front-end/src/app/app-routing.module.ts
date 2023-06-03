import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./Ui/components/login/login.component";
import {RegisterComponent} from "./Ui/components/register/register.component";
import {RegisterUserFormComponent} from "./Ui/components/register-user-form/register-user-form.component";
import {DashboardComponent} from "./Ui/pages/dashboard/dashboard.component";
import {VerifyEmailComponent} from "./Ui/components/verify-email/verify-email.component";
import {ResetPasswordComponent} from "./Ui/components/reset-password/reset-password.component";
import {RequestPasswordResetComponent} from "./Ui/components/request-password-reset/request-password-reset.component";
import {Enable2faComponent} from "./Ui/components/user-settings/enable2fa/enable2fa.component";
// import {EventCreateComponent} from "./Ui/components/event-create/event-create.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login/:eventId',
    component: LoginComponent, // This component will handle the login process
  },
  {path: 'register-old', component: RegisterComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterUserFormComponent},
  {path: 'register/:eventId', component: RegisterUserFormComponent},
  {path: 'verify_email/:token', component: VerifyEmailComponent},
  {path: 'reset_password/:token', component: ResetPasswordComponent},
  {path: 'request_reset_password', component: RequestPasswordResetComponent},
  {path: 'setup2fa', component: Enable2faComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
