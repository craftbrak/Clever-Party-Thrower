import { Module } from "@nestjs/common";
import { DeptService } from "./dept.service";
import { DeptResolver } from "./dept.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "../event/entities/event.entity";
import { UserEntity } from "../user/entities/user.entity";
import { Dept } from "./entities/dept.entity";
import { SpendingModule } from "../spending/spending.module";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";

@Module({
  providers: [DeptResolver, DeptService],
  imports: [
    TypeOrmModule.forFeature([Event, UserEntity, Dept, EventToUser]),
    SpendingModule,
  ],
})
export class DeptModule {}
