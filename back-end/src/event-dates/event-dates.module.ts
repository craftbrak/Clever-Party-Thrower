import { Module } from "@nestjs/common";
import { EventDatesService } from "./event-dates.service";
import { EventDatesResolver } from "./event-dates.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventDate } from "./entities/event-date.entity";

@Module({
  providers: [EventDatesResolver, EventDatesService],
  imports: [TypeOrmModule.forFeature([EventDate])],
})
export class EventDatesModule {}
