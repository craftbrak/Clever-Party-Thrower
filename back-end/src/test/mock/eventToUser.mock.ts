import { CreateEventToUserDto } from "../../event-to-user/dto/create-event-to-user.dto";
import { Event } from "../../event/entities/event.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Address } from "../../address/entities/address.entity";

export const EventToUserMock = (
  event: Event,
  user: UserEntity,
  address: Address,
): CreateEventToUserDto => {
  return {
    eventId: event.id,
    userId: user.id,
    addressId: address.id,
  };
};
