import { CreateShoppingListItemDto } from "../../shopping-list-items/dto/create-shopping-list-item.dto";
import { randBoolean, randFileName, randFloat } from "@ngneat/falso";
import { Event } from "../../event/entities/event.entity";
import { UserEntity } from "../../user/entities/user.entity";

export const ShoppingListItemMock = (
  event: Event,
  user: UserEntity,
): CreateShoppingListItemDto => {
  return {
    name: randFileName(),
    bought: randBoolean(),
    eventId: event.id,
    price: randFloat(),
    assignedId: user.id,
  };
};
