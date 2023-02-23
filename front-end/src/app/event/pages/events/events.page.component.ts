import {Component, OnInit} from '@angular/core';
import {EventService} from "../../event.service";
import {Event} from "@angular/router";

@Component({
  selector: 'events-page',
  templateUrl: './events.page.component.html',
  styleUrls: ['./events.page.component.scss']
})
export class EventsPageComponent implements OnInit {
  public events: Event[] = []

  constructor(private eventService: EventService) {
  }

  async ngOnInit(): Promise<void> {
    this.events = await this.eventService.getAll()
  }

}
