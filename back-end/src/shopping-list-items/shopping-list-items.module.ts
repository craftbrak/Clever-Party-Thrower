import { Module } from "@nestjs/common";
import { ShoppingListItemsService } from "./shopping-list-items.service";
import { ShoppingListItemsResolver } from "./shopping-list-items.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShoppingListItem } from "./entities/shopping-list-item.entity";
import { UserEntity } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Spending } from "../spending/entities/spending.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingListItem, UserEntity, Event, Spending]),
  ],
  providers: [ShoppingListItemsResolver, ShoppingListItemsService],
})
export class ShoppingListItemsModule {}
