import {Component, OnInit} from '@angular/core';
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-event-page',
  templateUrl: './event.page.component.html',
  styleUrls: ['./event.page.component.scss']
})
export class EventPageComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    //request events
    this.eventService.getAllEventId()
  }

}
