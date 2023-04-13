import {EntityBase} from "./EntityBase.entity";

export interface Address extends EntityBase {
  unitNumber: string;

  line1: string;

  city: string;
  postalCode: string;

  country: Country;

  countryId: Country["id"];
}

export interface Country extends EntityBase {
  name: string;

  code: string;
}

