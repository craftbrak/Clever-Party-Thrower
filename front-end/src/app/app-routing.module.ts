import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventsPageComponent} from "./event/pages/events/events.page.component";
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./auth/components/login/login.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    component: EventsPageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
