import { Test, TestingModule } from "@nestjs/testing";
import { SpendingResolver } from "./spending.resolver";
import { SpendingService } from "./spending.service";

describe("SpendingResolver", () => {
  let resolver: SpendingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpendingResolver, SpendingService],
    }).compile();

    resolver = module.get<SpendingResolver>(SpendingResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
