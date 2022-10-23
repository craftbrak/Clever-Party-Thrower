import { Test, TestingModule } from "@nestjs/testing";
import { EventToUserResolver } from "./event-to-user.resolver";
import { EventToUserService } from "./event-to-user.service";

describe("EventToUserResolver", () => {
  let resolver: EventToUserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventToUserResolver, EventToUserService],
    }).compile();

    resolver = module.get<EventToUserResolver>(EventToUserResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
