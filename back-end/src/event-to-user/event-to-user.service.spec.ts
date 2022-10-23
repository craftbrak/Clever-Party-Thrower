import { Test, TestingModule } from "@nestjs/testing";
import { EventToUserService } from "./event-to-user.service";

describe("EventToUserService", () => {
  let service: EventToUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventToUserService],
    }).compile();

    service = module.get<EventToUserService>(EventToUserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
