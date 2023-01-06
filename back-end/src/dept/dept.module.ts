import { Module } from "@nestjs/common";
import { DeptService } from "./dept.service";
import { DeptResolver } from "./dept.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "../event/entities/event.entity";
import { User } from "../user/entities/user.entity";
import { Dept } from "./entities/dept.entity";

@Module({
  providers: [DeptResolver, DeptService],
  imports: [TypeOrmModule.forFeature([Event, User, Dept])],
})
export class DeptModule {}
