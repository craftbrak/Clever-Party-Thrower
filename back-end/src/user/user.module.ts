import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { EventModule } from "../event/event.module";
import { AddressModule } from "../address/address.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), EventModule, AddressModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
