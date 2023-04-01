import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard} from "./auth.guard";
import {AuthService} from "./auth.service";
import {AuthStoreServiceProvider} from "./auth-store-provider";
import {LoginComponent} from './components/login/login.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    AuthStoreServiceProvider
  ]
})
export class AuthModule {
}
