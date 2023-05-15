import {Injectable} from '@angular/core';
import {EventService} from "./event.service";
import gql from "graphql-tag";
import {Apollo} from "apollo-angular";
import {AuthService} from "../auth/auth.service";
import {BootSizes, Car, Fuels} from "../entities/car.entity";
import {BehaviorSubject, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarpoolService {
  userCarsSource = new BehaviorSubject<userCars | undefined>(undefined)
  userCars = this.userCarsSource.asObservable()
  carpoolsSource = new BehaviorSubject<any | undefined>(undefined)
  carpools = this.carpoolsSource.asObservable()
  eventId: string | undefined

  constructor(private apollo: Apollo, private eventService: EventService, private authService: AuthService) {
    this.eventService.selectedEventId$.subscribe(value => {
        this.eventId = value!
        this.getUsersCars()
        this.getCarpool()
      }
    )
  }

  addCar(carData: CreateCarInput) {
    const mut = gql`
      mutation CreateCar($createCarInput: CreateCarDto!) {
        createCar(createCarInput: $createCarInput) {
          id
        }
      }
    `
    return this.apollo.mutate({
      mutation: mut,
      variables: {
        createCarInput: carData
      }//@ts-ignore
    }).pipe(map(value => value.data))
  }

  getUsersCars() {
    const q = gql`
    query User($userEmail: String!) {
      user(email: $userEmail) {
        id
        cars {
          bootSize
          consumption
          brand
          createdAt
          createdAt
          id
          fuel
          manualTransmission
          maxPassengers
          model
          range
          shared
          ownerId
        }
        name
        drivingLicence
        manual
      }
    }`
    return this.apollo.watchQuery<userCars>({
      query: q,
      fetchPolicy: "network-only",
      variables: {
        userEmail: this.authService.user?.email
      }
    }).valueChanges.pipe(map(value => value.data)).subscribe(
      (val) => {
        this.userCarsSource.next(val)
      }
    )
  }

  addCarpool() {

  }

  getCarpool() {
    const querry = gql`
      query Event($eventId: String!) {
        event(id: $eventId) {
          id
          carpools {
            arrival
            startPoint {
              city
              line1
              unitNumber
              postalCode
              country {
                id
                name
              }
              id
            }
            id
            routes {
              departure
              destination {
                id
                country {
                  id
                  name
                  code
                }
                city
                postalCode
                unitNumber
                line1
              }
              length
              pickup {
                avatar
                name
                id
              }
              starting {
                city
                id
                line1
                postalCode
                unitNumber
                country {
                  name
                  id
                }
              }
              id
            }
            totalLength
            endPoint {
              city
              country {
                id
                name
              }
              line1
              id
              unitNumber
              postalCode
            }
            departure
            createdAt
            driver {
              id
              name
              avatar
            }
            direction
            car {
              brand
              bootSize
              consumption
              fuel
              id
              manualTransmission
              maxPassengers
              model
              range
              shared
              ownerId
            }
          }
        }
      }
    `
    this.apollo.watchQuery({
      query: querry,
      variables: {
        eventId: this.eventId
      },
      fetchPolicy: "network-only"
    }).valueChanges.pipe(map(value => {
      console.log(value)
    })).subscribe(value => {
      this.carpoolsSource.next(value)
    })
  }

  addRoute() {

  }

}


export interface CreateCarInput {
  bootSize: BootSizes;
  brand: string;
  consumption: number;
  fuel: Fuels;
  manualTransmission: boolean;
  maxPassengers: number;
  model: string;
  range: number;
}

export interface userCars {
  id: string,
  name: string,
  drivingLicence: boolean,
  manual: boolean,
  cars: Car[]
}
