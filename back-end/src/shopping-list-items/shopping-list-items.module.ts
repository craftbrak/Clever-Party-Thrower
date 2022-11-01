import { Module } from "@nestjs/common";
import { ShoppingListItemsService } from "./shopping-list-items.service";
import { ShoppingListItemsResolver } from "./shopping-list-items.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShoppingListItem } from "./entities/shopping-list-item.entity";
import { User } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingListItem, User, Event])],
  providers: [ShoppingListItemsResolver, ShoppingListItemsService],
})
export class ShoppingListItemsModule {}
