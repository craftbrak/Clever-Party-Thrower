import {Component, OnInit} from '@angular/core';
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  eventId: string | undefined | null

  constructor(private eventService: EventService) {

  }

  ngOnInit(): void {
    this.eventService.selectedEventId$.subscribe(value => {
      this.eventId = value

    })
  }

}
