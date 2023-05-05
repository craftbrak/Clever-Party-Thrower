import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UiComponentsModule} from "../components/ui-components.module";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    UiComponentsModule
  ]
})
export class UiPagesModule {
}
