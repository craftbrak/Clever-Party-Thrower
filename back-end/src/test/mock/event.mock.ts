import { CreateEventDto } from "../../event/dto/create-event.dto";
import { randBoolean, randBrand, randNumber, randText } from "@ngneat/falso";

export const EventMock: CreateEventDto = {
  addressId: null,
  description: randText(),
  name: randBrand(),
  total: randNumber(),
  fixedDate: randBoolean(),
};
