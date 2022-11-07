import { CreateEventDto } from "../../event/dto/create-event.dto";
import { randBrand, randNumber, randText } from "@ngneat/falso";

export const EventMock: CreateEventDto = {
  addressId: null,
  description: randText(),
  name: randBrand(),
  total: randNumber(),
};
