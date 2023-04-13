import {Apollo} from "apollo-angular";
import gql from "graphql-tag"
import {map, Observable} from "rxjs";
import {Event} from "../entities/event.entity";
import {Injectable} from "@angular/core";

const Get_Events = gql`
  {
    getEvents(skip: 0,take: 10 ){
      nodes {
        name
        description
        carpools {
          id
        }
        selectedDate{
          numberVotes
          date
        }
        addressId
        availableDates{
          date
          numberVotes
        }
        fixedDate
        spendings {
          id
        }
        shoppingList {
          id
        }
        address {
          city
        }
        members(take: 10,skip: 0){
          id
          role
          user {
            id
            name
            avatar
          }
          address {
            id
          }
        }
      }
    }
  }
`
const getEventIds = gql`
  query getEvent($take: Int!){
    getEvents(take:$take, skip: 0){
      nodes {
        id
      }
    }
  }
`
const getEventNumber = gql`
  query countEvent{
    countEvents
  }
`
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
      selectedDate{
        id
        date
      }
    }
  }
`

@Injectable()
export class EventService {
  Events: Observable<Event[]> | undefined;
  EventsId: Observable<string[]> | undefined;
  EventNumber: Observable<number> | undefined
  SAYHELLO = gql`
    query Sayhello{
      sayHello
    }
  `

  constructor(private apollo: Apollo) {
    // this.getEventNumber().then();
  }

  async getAllEventId() {
    await this.getEventNumber()
    this.apollo.watchQuery<Observable<any>>({query: getEventIds, variables: {take: this.EventNumber}})
      .valueChanges.pipe(
      map((result) => {
        console.log(result.data)
        this.EventsId = result.data
      })
    )
  }

  getEventOverview(id: string) {
    return this.apollo.watchQuery<Observable<Event[]>>({
      query: getEventOverview,
      variables: {skip: 0, take: this.EventNumber, eventId: id}
    })
  }

  async getEventNumber() {
    this.apollo.watchQuery<Observable<number>>({query: getEventNumber})
      .valueChanges.subscribe(value => this.EventNumber = value.data)
  }

  // @ts-ignore
  createEvent(eventData: any): Observable<any> {
    // Use eventData to send a request to the server with the GraphQL API.
  }

  testBackEnd() {
    this.apollo.watchQuery({query: this.SAYHELLO}).valueChanges.subscribe(value => console.log(value))
  }
}
