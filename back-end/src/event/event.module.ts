import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event, EventToUser } from "./entities/event.entity";
import { EventToUserService } from "./EventToUser.service";

@Module({
  imports:[TypeOrmModule.forFeature([Event,EventToUser])],
  providers: [EventResolver, EventService,EventToUserService],
  exports:[EventToUserService]
})
export class EventModule {}
