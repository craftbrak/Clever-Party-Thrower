import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventPageComponent} from './pages/event/event.page.component';
import {EventsPageComponent} from "./pages/events/events.page.component";
import {EventOverviewComponent} from "./components/event-overview/event-overview.component";
import {EventCardComponent} from "./components/event-card/event-card.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";


@NgModule({
  declarations: [
    EventPageComponent,
    EventOverviewComponent,
    EventsPageComponent,
    EventCardComponent,
  ],
  exports: [
    EventsPageComponent,
    EventPageComponent,
    EventCardComponent,
    EventOverviewComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
  ]
})
export class EventModule {
}
