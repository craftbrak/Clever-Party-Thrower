import { CreateEventDateInput } from "../../event-dates/dto/create-event-date.input";
import { randSoonDate } from "@ngneat/falso";
import { Event } from "../../event/entities/event.entity";

export function EventDateMock(event: Event): CreateEventDateInput {
  return {
    eventId: event.id,
    date: randSoonDate(),
  };
}
