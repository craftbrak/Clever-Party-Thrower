import { Module } from "@nestjs/common";
import { SpendingService } from "./spending.service";
import { SpendingResolver } from "./spending.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Spending } from "./entities/spending.entity";
import { ShoppingListItem } from "../shopping-list-items/entities/shopping-list-item.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Event, Spending, ShoppingListItem]),
  ],
  providers: [SpendingResolver, SpendingService],
  exports: [SpendingService],
})
export class SpendingModule {}
