import {Component, Input, OnInit} from '@angular/core';
import {Apollo} from "apollo-angular";
import {EventService} from "../../../services/event.service";


@Component({
  selector: 'event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements OnInit {
  event: Event | undefined = undefined
  @Input() eventId: string | undefined;
  private take: number = 0;


  constructor(private apollo: Apollo, private eventService: EventService) {
  }

  ngOnInit(): void {
    console.log(this.eventId)
    if (this.eventId)
      this.eventService.getEventOverview(this.eventId).valueChanges.subscribe(data => console.log(data))
    // this.apollo.watchQuery<Observable<Event>>({
    //   query: getEventOverview,
    //   variables: {eventId: this.eventId, take: this.take}
    // })
    //   .valueChanges.subscribe(value => {
    //   value.data.subscribe((event: Event) => {
    //     this.event = event
    //   })
    // })
  }

}
