import {UserEntity} from "./user.entity";

export interface ShoppingListItem extends Node {
  name: string;
  price: number;
  assigned: UserEntity;
  bought: boolean;
  event: Event;
}
