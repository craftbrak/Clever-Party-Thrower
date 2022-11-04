import { Module } from "@nestjs/common";
import { SpendingService } from "./spending.service";
import { SpendingResolver } from "./spending.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Spending } from "./entities/spending.entity";
import { ShoppingListItem } from "../shopping-list-items/entities/shopping-list-item.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Event, Spending, ShoppingListItem]),
  ],
  providers: [SpendingResolver, SpendingService],
})
export class SpendingModule {}
