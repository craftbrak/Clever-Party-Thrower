import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventResolver } from "./event.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { EventToUserService } from "../event-to-user/event-to-user.service";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";
import { AddressModule } from "../address/address.module";
import { ShoppingListItemsModule } from "../shopping-list-items/shopping-list-items.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventToUser]),
    AddressModule,
    ShoppingListItemsModule,
  ],
  providers: [EventResolver, EventService, EventToUserService],
  exports: [EventToUserService, EventService],
})
export class EventModule {}
