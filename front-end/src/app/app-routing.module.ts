import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./Ui/components/login/login.component";
import {RegisterComponent} from "./Ui/components/register/register.component";
import {RegisterUserFormComponent} from "./Ui/components/register-user-form/register-user-form.component";
import {DashboardComponent} from "./Ui/pages/dashboard/dashboard.component";
import {DateSelectionComponent} from "./Ui/components/event-details/date-selection/date-selection.component";
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
  {path: 'eventDates', component: DateSelectionComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
