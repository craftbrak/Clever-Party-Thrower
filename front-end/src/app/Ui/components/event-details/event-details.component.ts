import {Component, OnInit} from '@angular/core';
import {EventService} from "../../../services/event.service";
import {Observable, startWith, Subject, switchMap, tap} from "rxjs";
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
  isEditing = false
  description: string = ''
  addressId: string = ""
  private dataRefreshTrigger$: Subject<void>;

  constructor(private eventService: EventService) {
    this.dataRefreshTrigger$ = new Subject<void>();
    this.eventService.selectedEventId$.subscribe(value => {
      this.eventId = value
      this.eventInfo$ = this.dataRefreshTrigger$.pipe(
        startWith(null),
        switchMap(() => {
          return this.eventService.getEventDetail(this.eventId!).pipe(
            tap(eventInfo => {
              this.description = eventInfo.event.description;
              this.addressId = eventInfo.event.address.id;
            })
          );
        })
      )
    })

  }

  updateAddressId(addressId: any) {
    if (addressId)
      this.addressId = addressId.id
  }

  editEvent() {
    if (this.isEditing) {
      this.eventService.updateEvent(this.eventId!, this.description, this.addressId).subscribe((value: any) => {
        this.dataRefreshTrigger$.next(value.data.updateEvent.id)
      })
    }
    this.isEditing = !this.isEditing
  }

  deleteEvent() {
    this.eventService.deleteEvent(this.eventId!).subscribe(value => {
      console.log(value)
      if (value) {
        window.location.reload()
      }
    })
  }

  ngOnInit(): void {
    this.eventService.eventToUserId$.subscribe(value => this.evenToUserId = value!)
  }

}
