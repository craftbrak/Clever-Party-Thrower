import { Module } from "@nestjs/common";

import { EventToUserResolver } from "./event-to-user.resolver";
import { EventToUserService } from "./event-to-user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventToUser } from "./entities/event-to-user.entity";
import { AddressModule } from "../address/address.module";
import { ShoppingListItemsModule } from "../shopping-list-items/shopping-list-items.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([EventToUser]),
    AddressModule,
    ShoppingListItemsModule,
  ],
  providers: [EventToUserResolver, EventToUserService],
})
export class EventToUserModule {}
