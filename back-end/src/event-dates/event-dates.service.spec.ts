import { Test, TestingModule } from '@nestjs/testing';
import { EventDatesService } from './event-dates.service';

describe('EventDatesService', () => {
  let service: EventDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventDatesService],
    }).compile();

    service = module.get<EventDatesService>(EventDatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
