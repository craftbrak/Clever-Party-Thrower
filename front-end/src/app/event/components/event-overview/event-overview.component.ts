import {Component, Input, OnInit} from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {Observable} from "rxjs";

const getEventOverview = gql`
  query event($eventId: String!, $take: Int!){
    event(id: $eventId ){
      id
      name
      description
      address {
        city
        country {
          code
        }
      }
      members(skip: 0, take: $take){
        id
        role
      }
      availableDates
      selectedDate
    }
  }
`

@Component({
  selector: 'event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements OnInit {
  event: Event | undefined = undefined
  @Input() eventId: string | undefined;
  private take: number = 0;


  constructor(private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.apollo.watchQuery<Observable<Event>>({
      query: getEventOverview,
      variables: {eventId: this.eventId, take: this.take}
    })
      .valueChanges.subscribe(value => {
      value.data.subscribe((event: Event) => {
        this.event = event
      })
    })
  }

}
