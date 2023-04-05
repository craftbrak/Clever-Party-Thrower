import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventsPageComponent} from "./event/pages/events/events.page.component";
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./Ui/components/login/login.component";
import {RegisterComponent} from "./Ui/components/register/register.component";
import {RegisterUserFormComponent} from "./Ui/components/register-user-form/register-user-form.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    component: EventsPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {path: 'register', component: RegisterComponent},
  {path: 'register-new', component: RegisterUserFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
