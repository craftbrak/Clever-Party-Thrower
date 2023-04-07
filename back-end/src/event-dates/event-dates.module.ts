import { Module } from '@nestjs/common';
import { EventDatesService } from './event-dates.service';
import { EventDatesResolver } from './event-dates.resolver';

@Module({
  providers: [EventDatesResolver, EventDatesService]
})
export class EventDatesModule {}
