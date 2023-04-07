import { Test, TestingModule } from '@nestjs/testing';
import { DatesToUserResolver } from './dates-to-user.resolver';
import { DatesToUserService } from './dates-to-user.service';

describe('DatesToUserResolver', () => {
  let resolver: DatesToUserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatesToUserResolver, DatesToUserService],
    }).compile();

    resolver = module.get<DatesToUserResolver>(DatesToUserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
