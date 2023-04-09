import { Module } from "@nestjs/common";
import { EventDatesService } from "./event-dates.service";
import { EventDatesResolver } from "./event-dates.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventDate } from "./entities/event-date.entity";
import { Event } from "../event/entities/event.entity";
import { EventModule } from "../event/event.module";
import { DatesToUser } from "../dates-to-user/entities/dates-to-user.entity";

@Module({
  providers: [EventDatesResolver, EventDatesService],
  imports: [
    TypeOrmModule.forFeature([EventDate, Event, DatesToUser]),
    EventModule,
  ],
  exports: [EventDatesService],
})
export class EventDatesModule {}
