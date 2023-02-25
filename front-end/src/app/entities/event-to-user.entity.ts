import {UserEntity} from "./user.entity";
import {EntityBase} from "./EntityBase.entity";
import {Address} from "./address.entity";
import {Event} from "./event.entity";

export enum UserRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
  DJ = "DJ",
  INVITED = "INVITED",
}
export interface EventToUser extends EntityBase {
  userId: UserEntity["id"];
  eventId: Event["id"];

  event: Event;

  user: UserEntity;

  address: Address;

  addressId: Address["id"];
  role: UserRole;
  availableDates: Date[];
}
