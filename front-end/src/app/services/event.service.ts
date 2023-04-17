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

  createEventAndRelatedData(eventData: any, eventToUserData: any, eventDateData: any) {
    const createEventMutation = gql`
      mutation CreateEvent($input: CreateEventDto!) {
        createEvent(createEventInput: $input) {
          id
          name
          description
          total
          addressId
          fixedDate
        }
      }
    `;
    return new Observable((observer) => {
      console.info("creating event")
      this.apollo
        .mutate({
          mutation: createEventMutation,
          variables: {
            input: eventData
          }
        }) //@ts-ignore
        .subscribe(({data}) => {
          const eventId = data.createEvent.id;

          this.createEventToUser(eventToUserData, eventId);
          this.createEventDate(eventDateData, eventId);
          observer.next({status: 'success', data: data});
          observer.complete();
        }, (error) => {
          observer.error({status: 'error', message: "failed to create a event", error: error})
        });
    })
  }

  createEventToUser(eventToUserData: any, eventId: string) {
    const createEventToUserMutation = gql`
      mutation CreateEventToUser($input: CreateEventToUserDto!) {
        createEventToUser(createEventToUserInput: $input) {
          id
          userId
          eventId
          addressId
        }
      }
    `;
    console.info("creating event to user with data ", eventToUserData, eventId)
    this.apollo
      .mutate({
        mutation: createEventToUserMutation,
        variables: {
          input: {
            ...eventToUserData,
            eventId
          }
        }
      }) //@ts-ignore
      .subscribe(({data}) => {
        console.info('EventToUser created:', data.createEventToUser);
      });
  }

  createEventDate(eventDateData: Date[], eventId: string) {
    const createEventDateMutation = gql`
      mutation CreateEventDate($input: CreateEventDateInput!) {
        createEventDate(createEventDateInput: $input) {
          id
          date
          eventId
          numberVotes
        }
      }
    `;
    for (const date of eventDateData) {
      this.apollo
        .mutate({
          mutation: createEventDateMutation,
          variables: {
            input: {
              date,
              eventId
            }
          }
        })//@ts-ignore
        .subscribe(({data}) => {
          console.log('EventDate created:', data.createEventDate);
        });
    }
  }

  testBackEnd() {
    // this.apollo.watchQuery({query: this.SAYHELLO}).valueChanges.subscribe(value => console.log(value))
  }
}
