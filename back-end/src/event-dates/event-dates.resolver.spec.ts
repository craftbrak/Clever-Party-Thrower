import { Test, TestingModule } from '@nestjs/testing';
import { EventDatesResolver } from './event-dates.resolver';
import { EventDatesService } from './event-dates.service';

describe('EventDatesResolver', () => {
  let resolver: EventDatesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventDatesResolver, EventDatesService],
    }).compile();

    resolver = module.get<EventDatesResolver>(EventDatesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
