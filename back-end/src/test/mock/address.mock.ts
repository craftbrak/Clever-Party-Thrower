import { CreateAddressDto } from "../../address/dto/create-address.dto";
import { randAddress, randCity, randNumber } from "@ngneat/falso";

export const addressMock: CreateAddressDto = {
  city: randCity(),
  countryId: "",
  line1: randAddress().street,
  line2: null,
  postalCode: randAddress().zipCode,
  streetNumber: randNumber().toString(),
  unitNumber: "",
};
