import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { EventModule } from "../event/event.module";
import { AddressModule } from "../address/address.module";
import { HttpModule } from "@nestjs/axios";
import { Car } from "../car/entities/car.entity";
import { Address } from "../address/entities/address.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Car, Address]),
    EventModule,
    AddressModule,
    HttpModule,
    JwtModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
