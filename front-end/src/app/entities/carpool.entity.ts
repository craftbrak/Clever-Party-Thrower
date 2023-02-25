import {UserEntity} from "./user.entity";
import {Address} from "./address.entity";
import {Car} from "./car.entity";
import {EntityBase} from "./EntityBase.entity";

export enum Directions {
  go = "go",
  back = "back",
}
export interface Carpool extends EntityBase {
  driver: UserEntity;
  routes: RouteEntity[];
  direction: Directions;
  endPoint: Address;
  startPoint: Address;
  car: Car;
  event: Event;
  totalLength: number;
  departure: Date;
  arrival: Date;
}
export interface RouteEntity extends EntityBase {
  starting: Address;
  pickup: UserEntity;
  destination: Address;
  index: number;
  length: number;
  carpool: Carpool;
  departure: Date;
}
