import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventResolver } from "./event.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { EventToUserService } from "./EventToUser.service";
import { EventToUser } from "./entities/eventToUser.entity";
import { AddressModule } from "../address/address.module";

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventToUser]), AddressModule],
  providers: [EventResolver, EventService, EventToUserService],
  exports: [EventToUserService],
})
export class EventModule {}
