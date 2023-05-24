import {Event} from "./event.entity";
import {UserEntity} from "./user.entity";
import {ShoppingListItem} from "./shopping-list-item.entity";
import {EntityBase} from "./EntityBase.entity";

export interface Spending extends EntityBase {
  buyer: UserEntity;

  event: Event;

  value: number;

  shoppingListItem: ShoppingListItem;
  beneficiary: UserEntity;
}
