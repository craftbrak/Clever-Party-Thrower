import {Component, OnInit} from '@angular/core';
import {EventService} from "../../../services/event.service";
import {map} from "rxjs";

@Component({
  selector: 'events-page',
  templateUrl: './events.page.component.html',
  styleUrls: ['./events.page.component.scss']
})
export class EventsPageComponent implements OnInit {
  public eventsId: string[] = []

  constructor(private eventService: EventService) {
  }

  async ngOnInit(): Promise<void> {
    // await this.eventService.getAllEventId()
    console.log('Event number:', this.eventService.EventNumber)
    this.eventService.EventsId?.pipe(
      map(data => {
        this.eventsId = data
      })
    )

  }

}
