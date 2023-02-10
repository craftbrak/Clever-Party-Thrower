import { CreateUserDto } from "../../user/dto/create-user.dto";
import {
  randBoolean,
  randEmail,
  randFullName,
  randPassword,
  randUrl,
} from "@ngneat/falso";

export const testUser: CreateUserDto = {
  addressId: "",
  name: "test",
  email: "test@test.com",
  password: "test",
  manual: false,
  drivingLicence: false,
};
export const userMock1: CreateUserDto = {
  email: randEmail(),
  name: randFullName(),
  addressId: null,
  drivingLicence: randBoolean(),
  manual: randBoolean(),
  password: randPassword(),
};
export const userMock2: CreateUserDto = {
  email: randEmail(),
  name: randFullName(),
  addressId: null,
  drivingLicence: randBoolean(),
  manual: randBoolean(),
  password: randPassword(),
};
export function userMock(): CreateUserDto {
  return {
    email: randEmail(),
    name: randFullName(),
    addressId: null,
    drivingLicence: randBoolean(),
    manual: randBoolean(),
    password: randPassword(),
  };
}
