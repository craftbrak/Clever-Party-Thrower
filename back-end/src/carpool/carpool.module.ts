import { Module } from "@nestjs/common";
import { CarpoolService } from "./carpool.service";
import { CarpoolResolver } from "./carpool.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Carpool } from "./entities/carpool.entity";
import { Route } from "./entities/Route.entity";
import { Car } from "../car/entities/car.entity";
import { User } from "../user/entities/user.entity";
import { Address } from "../address/entities/address.entity";
import { Event } from "../event/entities/event.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Carpool, Route, Car, Event, User, Address]),
  ],
  providers: [CarpoolResolver, CarpoolService],
})
export class CarpoolModule {}
