import { CreateAddressDto } from "../../address/dto/create-address.dto";
import { randAddress, randCity } from "@ngneat/falso";

export const addressMock: CreateAddressDto = {
  city: randCity(),
  countryId: "",
  line1: randAddress().street,
  postalCode: randAddress().zipCode,
  unitNumber: "",
  ownerId: "",
};
