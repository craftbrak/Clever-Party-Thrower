import {Component, OnInit} from '@angular/core';
import {EventService} from "../../../services/event.service";
import {Observable, startWith, Subject, switchMap} from "rxjs";
import {EventData} from "../../../../entities/gql-retun-types";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  eventId: string | undefined | null
  evenToUserId: string | undefined;
  eventInfo$: Observable<EventData> | undefined
  private dataRefreshTrigger$: Subject<void>;

  constructor(private eventService: EventService) {
    this.dataRefreshTrigger$ = new Subject<void>();
    this.eventService.selectedEventId$.subscribe(value => {
      this.eventId = value
      this.eventInfo$ = this.dataRefreshTrigger$.pipe(
        startWith(null),
        switchMap(() => {
          return this.eventService.getEventDetail(this.eventId!)
        })
      )
    })

  }

  ngOnInit(): void {
    this.eventService.eventToUserId$.subscribe(value => this.evenToUserId = value!)
  }

}
