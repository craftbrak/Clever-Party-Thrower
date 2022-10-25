import { Test, TestingModule } from "@nestjs/testing";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { EventToUserService } from "../event-to-user/event-to-user.service";
import { AddressService } from "../address/address.service";

describe("UserResolver", () => {
  let resolver: UserResolver;
  const mockUserService = {};
  const mockAddressService = {};
  const mockEventToUserService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService],
    })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .overrideProvider(EventToUserService)
        .useValue(mockEventToUserService)
        .overrideProvider(AddressService)
        .useValue(mockAddressService)
        .compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
