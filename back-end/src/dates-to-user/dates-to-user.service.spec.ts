import { Test, TestingModule } from '@nestjs/testing';
import { DatesToUserService } from './dates-to-user.service';

describe('DatesToUserService', () => {
  let service: DatesToUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatesToUserService],
    }).compile();

    service = module.get<DatesToUserService>(DatesToUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
