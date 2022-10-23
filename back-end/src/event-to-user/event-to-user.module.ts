import { Module } from "@nestjs/common";

import { EventToUserResolver } from "./event-to-user.resolver";
import { EventToUserService } from "./event-to-user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventToUser } from "./entities/event-to-user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EventToUser])],
  providers: [EventToUserResolver, EventToUserService],
})
export class EventToUserModule {}
