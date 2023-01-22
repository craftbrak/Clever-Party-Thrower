import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { EventModule } from "../event/event.module";
import { AddressModule } from "../address/address.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EventModule,
    AddressModule,
    HttpModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
