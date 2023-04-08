import { Module } from "@nestjs/common";
import { DatesToUserService } from "./dates-to-user.service";
import { DatesToUserResolver } from "./dates-to-user.resolver";
import { DatesToUser } from "./entities/dates-to-user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventModule } from "../event/event.module";
import { EventDatesModule } from "../event-dates/event-dates.module";
import { EventDate } from "../event-dates/entities/event-date.entity";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";

@Module({
  providers: [DatesToUserResolver, DatesToUserService],
  imports: [
    TypeOrmModule.forFeature([DatesToUser, EventDate, EventToUser]),
    EventModule,
    EventDatesModule,
  ],
})
export class DatesToUserModule {}
