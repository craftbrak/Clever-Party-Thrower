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
  avatar: null,
  manual: false,
  drivingLicence: false,
};
export const userStub: CreateUserDto = {
  email: randEmail(),
  name: randFullName(),
  addressId: "",
  drivingLicence: randBoolean(),
  avatar: randUrl(),
  manual: randBoolean(),
  password: randPassword(),
};
