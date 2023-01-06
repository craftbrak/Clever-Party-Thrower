import { Test, TestingModule } from "@nestjs/testing";
import { DeptResolver } from "./dept.resolver";
import { DeptService } from "./dept.service";

describe("DeptResolver", () => {
  let resolver: DeptResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeptResolver, DeptService],
    }).compile();

    resolver = module.get<DeptResolver>(DeptResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
