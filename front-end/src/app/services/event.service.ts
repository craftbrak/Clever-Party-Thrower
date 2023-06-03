import {Apollo} from "apollo-angular";
import gql from "graphql-tag"
import {BehaviorSubject, forkJoin, map, Observable} from "rxjs";
import {Event} from "../entities/event.entity";
import {Injectable} from "@angular/core";
import {UserRole} from "../entities/event-to-user.entity";
import {UserEvents} from "../Ui/pages/dashboard/dashboard.component";
import {MemberData} from "../Ui/components/event-details/members/members.component";
import {Event_requestData} from "../Ui/components/event-details/date-selection/date-selection.component";
import {Event_shoppingList} from "../Ui/components/event-details/shoppinglist/shoppinglist.component";
import {EventData} from "../../entities/gql-retun-types";

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
            id
            date
          }
          availableDates {
            id
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

  private eventToUserSource = new BehaviorSubject<string | null>(null)
  eventToUserId$ = this.eventToUserSource.asObservable()
  private isOwnerSource = new BehaviorSubject<boolean>(false)
  isOwner$ = this.isOwnerSource.asObservable()


  constructor(private apollo: Apollo) {
    this.eventToUserId$.subscribe(value => {
      this.updateIsOwner(value!)
    })
  }

  updateEventId(id: string) {
    this.selectedEventIdSource.next(id)
  }

  updateEventToUserId(id: string) {
    this.eventToUserSource.next(id)
  }

  updateIsOwner(eventToUserId: string) {
    const q = gql`
      query EventToUser($eventToUserId: String!) {
        eventToUser(id: $eventToUserId) {
          role
        }
      }
    `
    if (eventToUserId) {
      this.apollo.watchQuery<{
        eventToUser: {
          role: UserRole
        }
      }>({
        query: q,
        variables: {
          eventToUserId: eventToUserId
        }
      }).valueChanges.subscribe(value => {
        // console.log(value)
        if (value.data.eventToUser.role === UserRole.OWNER) this.isOwnerSource.next(true)
        else this.isOwnerSource.next(false)
      })
    }

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
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map(result => {
        // console.log(result.data)
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

          this.createEventToUser(eventToUserData, eventId, UserRole.OWNER).subscribe(value => {
            const observables = eventDateData.map((date: Date) => this.createEventDate(date, eventId))
            forkJoin(observables).subscribe((results) => {
              observer.next({status: 'success', data: data});
              observer.complete();
            })
          });

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
      query GetEventUsers($id: String!) {
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

  getEventUserData(id: string): Observable<MemberData> {
    const GET_EVENT_BY_ID = gql`
  query EventToUser($id: String!) {
  eventToUser(id: $id) {
    id
    role
    user {
      id
      name
      avatar
    }
  }
}
    `;
    return this.apollo
      .watchQuery<{
        eventToUser: MemberData
      }>({
        query: GET_EVENT_BY_ID,
        variables: {id},
      })
      .valueChanges.pipe(map((result) => result.data.eventToUser));
  }

  getEventDatesData(id: string): Observable<Event_requestData> {
    const getEventQuery = gql`
      query getEventDates($eventId: String!) {
        event(id: $eventId) {
          id
          selectedDate {
            id
            date
            datesToUsers {
              voteValue
              eventToUser {
                role
                user {
                  avatar
                  name
                  id
                }
                id
              }
              id
            }
            numberVotes
          }
          fixedDate
          availableDates {
            id
            numberVotes
            date
            datesToUsers {
              voteValue
              eventToUser {
                role
                user {
                  avatar
                  name
                  id
                }
                id
              }
              id
            }
          }
        }
      }
    `;
    return this.apollo.watchQuery<{ event: Event_requestData }>({
      query: getEventQuery,
      variables: {
        eventId: id,
      },
      fetchPolicy: "network-only"
    }).valueChanges.pipe(
      map(result => result.data.event)
    );
  }

  UpdateSelectedDate(eventId: string, eventDateId: string) {
    const updateEventMutation = gql`
      mutation UpdateEvent($updateEventInput: UpdateEventDto!) {
        updateEvent(updateEventInput: $updateEventInput) {
          id
          selectedDate {
            id
            date
          }
          fixedDate
        }
      }
    `;

    return this.apollo.mutate({
      mutation: updateEventMutation,
      variables: {
        updateEventInput: {
          id: eventId,
          selectedDateId: eventDateId
        }
      } // @ts-ignore
    }).pipe(map(value => value.data))
  }

  AddEventDate(eventId: string, date: Date): Observable<{ eventDate: { id: string, date: string } }> {
    const mut = gql`
      mutation CreateEventDate($createEventDateInput: CreateEventDateInput!) {
        createEventDate(createEventDateInput: $createEventDateInput) {
          id
          date
        }
      }`
    return this.apollo.mutate({
      mutation: mut,
      variables: {
        createEventDateInput: {
          eventId: eventId,
          date: date
        }
      }//@ts-ignore
    }).pipe(map(value => value.data))
  }

  voteForDate(eventDateId: string, eventToUserId: string, voteValue: number, originalNumberOfVotes: number) {
    const mut = gql`mutation CreateDatesToUser($createDatesToUserInput: CreateDatesToUserInput!, $updateEventDateInput: UpdateEventDateInput!) {
      createDatesToUser(createDatesToUserInput: $createDatesToUserInput) {
        id
        eventToUser {
          id
          user {
            id
            avatar
            name
          }
        }
      }
      updateEventDate(updateEventDateInput: $updateEventDateInput) {
        numberVotes
        date
        id
      }
    }`
    return this.apollo.mutate({
      mutation: mut,
      variables: {
        createDatesToUserInput: {
          eventDateId: eventDateId,
          eventToUserId: eventToUserId,
          voteValue: 1
        },
        updateEventDateInput: {
          id: eventDateId,
          numberVotes: originalNumberOfVotes + 1
        }
      }//@ts-ignore
    }).pipe(map(value => value.data))
  }

  removeVoteForDate(dateToUserId: string, eventDateId: string, orignialNumberOfVotes: number) {
    const mut = gql`mutation RemoveDatesToUser($removeDatesToUserId: String!, $updateEventDateUpdateEventDateInput2: UpdateEventDateInput!) {
      removeDatesToUser(id: $removeDatesToUserId)
      ateEventDate(updateEventDateInput: $updateEventDateUpdateEventDateInput2) {
        id
        numberVotes
      }
    }`

    return this.apollo.mutate({
      mutation: mut,
      variables: {
        removeDatesToUserId: dateToUserId,
        updateEventDateUpdateEventDateInput2: {
          id: eventDateId,
          numberVotes: orignialNumberOfVotes
        }
      }// @ts-ignore
    }).pipe(map(value => value.data))
  }

  getEventShoppingList(eventId: string): Observable<Event_shoppingList> {
    const mut = gql`
      query GetEventShoppingList($eventId: String!) {
        event(id: $eventId) {
          shoppingList {
            assigned {
              avatar
              id
              name
            }
            id
            name
            price
            bought
          }
          id
        }
      }`
    return this.apollo.watchQuery<{ event: Event_shoppingList }>({
      query: mut,
      fetchPolicy: "network-only",
      variables: {
        eventId: eventId
      }
    }).valueChanges.pipe(map(value => {
      return value.data.event
    }))
  }

  addShoppingListItem(eventId: string, createShoppingListItem: {
    assignedId: string,
    bought: boolean,
    name: string,
    price: number
  }) {
    const mut = gql`
      mutation CreateShoppingListItem($createShoppingListItemDto: CreateShoppingListItemDto!) {
        createShoppingListItem(createShoppingListItemDto: $createShoppingListItemDto) {
          id
        }
      }`
    return this.apollo.mutate({
      mutation: mut,
      variables: {
        createShoppingListItemDto: {
          assignedId: createShoppingListItem.assignedId,
          bought: createShoppingListItem.bought,
          eventId: eventId,
          name: createShoppingListItem.name,
          price: createShoppingListItem.price
        }
      }//@ts-ignore
    }).pipe(map(value => value.data))

  }

  updateShoppingListItem(itemId: string, eventId: string, createShoppingListItem: {
    bought?: boolean,
    name?: string,
    price?: number,
    assignedId?: string,
  }) {
    const mut = gql`
      mutation UpdateShoppingListItem($updateShoppingListItemInput: UpdateShoppingListItemDto!) {
        updateShoppingListItem(updateShoppingListItemInput: $updateShoppingListItemInput)
      }`
    return this.apollo.mutate({
      mutation: mut,
      fetchPolicy: "network-only",
      variables: {
        updateShoppingListItemInput: {
          id: itemId,
          bought: createShoppingListItem.bought,
          name: createShoppingListItem.name,
          price: createShoppingListItem.price,
          eventId: eventId,
          assignedId: createShoppingListItem.assignedId
        }
      }//@ts-ignore
    }).pipe(map(value => value.data))
  }

  deleteShoppingListItem(id: string) {
    const mut = gql`
      mutation RemoveShoppingListItem($removeShoppingListItemId: String!) {
        removeShoppingListItem(id: $removeShoppingListItemId)
      }
    `
    return this.apollo.mutate({
      mutation: mut,
      fetchPolicy: "network-only",
      variables: {
        removeShoppingListItemId: id
      }
    })
  }

  addEventToUser(eventId: string, userId: string) {
    const mut = gql`mutation CreateEventToUser($ce: CreateEventToUserDto!) {
  createEventToUser(createEventToUserInput: $ce) {
    id
  }
}`
    return this.apollo.mutate({
      mutation: mut,
      variables: {
        ce: {
          userId: userId,
          eventId: eventId
        }
      },
      fetchPolicy: "network-only" //@ts-ignore
    }).pipe(map(value => value.data))
  }

  updateUserRole(eventToUserId: string, role: UserRole) {
    const mut = gql`
    mutation UpdateEventToUser($updateEventToUserInput: UpdateEventToUserDto!) {
  updateEventToUser(updateEventToUserInput: $updateEventToUserInput) {
    id
  }
}`
    return this.apollo.mutate({
      mutation: mut,
      variables: {
        updateEventToUserInput: {
          id: eventToUserId,
          role: role
        }
      }
    })
  }

  getEventDetail(eventId: string): Observable<EventData> {
    const mut = gql`
    query Event($eventId: String!) {
      event(id: $eventId) {
        id
        name
        description
        address {
          postalCode
          unitNumber
          line1
          city
          country {
            name
            id
          }
          id
        }
      }
  }`
    return this.apollo.watchQuery<EventData>({
      query: mut,
      variables: {
        eventId: eventId
      }
    }).valueChanges.pipe(map(value => value.data))
  }

  getparticipants(eventId: string) {

  }
}
