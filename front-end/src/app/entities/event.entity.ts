import {Spending} from "./spending.entity";
import {EntityBase} from "./EntityBase.entity";
import {EventToUser} from "./event-to-user.entity";
import {ShoppingListItem} from "./shopping-list-item.entity";
import {Address} from "./address.entity";
import {Carpool} from "./carpool.entity";

export interface Event extends EntityBase {
  name: string;
  description: string;
  total: number;
  members: EventToUser[];
  address: Address;
  addressId: Address["id"];
  carpools: Carpool[]; //TODO: DTO
  shoppingList: ShoppingListItem[]; //TODO: DTO
  spendings: Spending[];
  selectedDate: Date;
  availableDates: Date[];
}
