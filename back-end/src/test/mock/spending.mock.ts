import { randFloat } from "@ngneat/falso";
import { Event } from "../../event/entities/event.entity";
import { User } from "../../user/entities/user.entity";
import { CreateSpendingDto } from "../../spending/dto/create-spending.dto";
import { ShoppingListItem } from "../../shopping-list-items/entities/shopping-list-item.entity";

export const SpendingMock = (
  event: Event,
  user: User,
  item: ShoppingListItem = null,
): CreateSpendingDto => {
  return {
    value: randFloat(),
    buyerId: user.id,
    eventId: event.id,
    shoppingListItemId: item?.id,
  };
};
