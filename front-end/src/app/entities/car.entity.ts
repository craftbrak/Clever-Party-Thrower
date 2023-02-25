import {UserEntity} from "./user.entity";

export enum BootSizes {
  None = "None",
  Small = "Small",
  Medium = "Medium",
  Big = "Big",
  CampingCar = "CampingCar",
}
export enum Fuels {
  Electric = "Electric",
  Petrol = "Petrol",
  Diesel = "Diesel",
  LPG = "LPG",
  HYDROGEN = "HYDROGEN",
}
export interface Car extends Node {
  brand: string;
  model: string;
  maxPassengers: number;
  consumption: number;


  bootSize: BootSizes;

  fuel:  Fuels ;

  manualTransmission: boolean;

  range: number;

  shared: boolean;

  owner: UserEntity;

  ownerId: UserEntity["id"];
}
