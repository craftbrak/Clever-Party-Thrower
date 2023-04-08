import { CreateDatesToUserInput } from "../../dates-to-user/dto/create-dates-to-user.input";
import { EventDate } from "../../event-dates/entities/event-date.entity";
import { randNumber } from "@ngneat/falso";
import { EventToUser } from "../../event-to-user/entities/event-to-user.entity";

export function DatesToUserMock(
  eventDate: EventDate,
  eventToUser: EventToUser,
): CreateDatesToUserInput {
  return {
    eventDateId: eventDate.id,
    eventToUserId: eventToUser.id,
    voteValue: randNumber(),
  };
}
