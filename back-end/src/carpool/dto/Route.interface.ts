import { Address } from "../../address/entities/address.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Carpool } from "../entities/carpool.entity";

export interface Route {
  starting: Address;

  pickup: UserEntity;

  destination: Address;

  index: number;

  length: number;

  carpool: Carpool;

  departure: Date;
}
