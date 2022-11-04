import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { UserService } from "../user/user.service";
import { testUser } from "./mock/user.mock";
import { AddressService } from "../address/address.service";
import { addressMock } from "./mock/address.mock";

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  await app.init();
  const addressService = moduleRef.get<AddressService>(AddressService);
  await addressService.onApplicationBootstrap();
  const country = await addressService.findOneCountryByCode("BEL");
  const address = await addressService.create({
    ...addressMock,
    countryId: country.id,
  });
  const userService = moduleRef.get<UserService>(UserService);
  await userService.create({ ...testUser, addressId: address.id });
  console.log("setup finished");
};
