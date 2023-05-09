import {Apollo} from "apollo-angular";
import gql from "graphql-tag"
import {BehaviorSubject, forkJoin, map, Observable} from "rxjs";
import {Event} from "../entities/event.entity";
import {Injectable} from "@angular/core";
import {UserRole} from "../entities/event-to-user.entity";
import {UserEvents} from "../Ui/pages/dashboard/dashboard.component";
import {MemberData} from "../Ui/components/event-details/members/members.component";

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
const GET_USER_EVENT_DATA = gql`
  query GetUserEventsAndDetails($id: String!) {
    user(email: $id) {
      eventToUsers {
        id
        role
        event {
          id
          name
          selectedDate {
            date
          }
          availableDates {
            date
          }
          description
          address {
            country{
              code
            }
            city
          }
          members(skip: 0, take: 10) {
            id
            role
            user {
              id
              name
              avatar
            }
          }
        }
      }
    }
  }
`;

@Injectable()
export class EventService {
  Events: (Observable<Event[]>) = Observable.create([]);
  EventsId: string[] | undefined;
  EventNumber: number | undefined

  private selectedEventIdSource = new BehaviorSubject<string | null>(null)
  selectedEventId$ = this.selectedEventIdSource.asObservable()

  constructor(private apollo: Apollo) {
    this.getEventNumber().then();
  }

  updateEventId(id: string) {
    this.selectedEventIdSource.next(id)
  }

  async getAllEventId() {
    await this.getEventNumber()
    this.apollo.watchQuery<Observable<any>>({query: getEventIds, variables: {take: this.EventNumber}})
      .valueChanges.subscribe(value => {
      value.data.subscribe(value1 => {
        this.EventsId = value1
      })
    })
  }

  // getEventOverview(id: string) {
  //   return this.apollo.watchQuery<Observable<Event[]>>({
  //     query: getEventOverview,
  //     variables: {skip: 0, take: this.EventNumber, eventId: id}
  //   })
  // }
  getUserEventData(email: string): Observable<UserEvents> {
    return this.apollo
      .watchQuery<UserEvents>({
        query: GET_USER_EVENT_DATA,
        variables: {id: email},
      })
      .valueChanges.pipe(map(result => {
        console.log(result.data)
        return result.data
      }));
  }

  async getEventNumber() {
    this.apollo.watchQuery<number>({query: getEventNumber})
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

          this.createEventToUser(eventToUserData, eventId, UserRole.OWNER).subscribe();
          const observables = eventDateData.map((date: Date) => this.createEventDate(date, eventId))
          forkJoin(observables).subscribe((results) => {
            observer.next({status: 'success', data: data});
            observer.complete();
          })
        }, (error) => {
          observer.error({status: 'error', message: "failed to create a event", error: error})
        });
    })
  }

  createEventToUser(eventToUserData: any, eventId: string, userRole = UserRole.INVITED) {
    const createEventToUserMutation = gql`
      mutation CreateEventToUser($input: CreateEventToUserDto!) {
        createEventToUser(createEventToUserInput: $input) {
          id
          userId
          eventId
          addressId
          role
        }
      }
    `;
    console.info("creating event to user with data ", eventToUserData, eventId)
    return this.apollo
      .mutate({
        mutation: createEventToUserMutation,
        variables: {
          input: {
            userId: eventToUserData.userId,
            eventId: eventId,
            addressId: eventToUserData.addressId,
            role: userRole
          }
        }
      })
  }

  createEventDate(date: Date, eventId: string) {
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
    return this.apollo
      .mutate({
        mutation: createEventDateMutation,
        variables: {
          input: {
            date,
            eventId
          }
        }
      })
  }

  testBackEnd() {
    // this.apollo.watchQuery({query: this.SAYHELLO}).valueChanges.subscribe(value => console.log(value))
  }

  getEventUsers(id: string): Observable<MemberData[]> {
    const GET_EVENT_BY_ID = gql`
      query GetEventById($id: String!) {
        event(id: $id) {
          id
          members (skip:0, take: 100) {
            id
            role
            user {
              id
              name
              avatar
            }
          }
        }
      }
    `;
    return this.apollo
      .watchQuery<{
        event: {
          id: string
          members: MemberData[]
        }
      }>({
        query: GET_EVENT_BY_ID,
        variables: {id},
      })
      .valueChanges.pipe(map((result) => result.data.event.members));
  }


}
