import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { EventModule } from "../event/event.module";
import { AddressModule } from "../address/address.module";
import { HttpModule } from "@nestjs/axios";
import { Car } from "../car/entities/car.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Car]),
    EventModule,
    AddressModule,
    HttpModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
