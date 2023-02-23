import { Module } from "@nestjs/common";
import { CarpoolService } from "./carpool.service";
import { CarpoolResolver } from "./carpool.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Carpool } from "./entities/carpool.entity";
import { RouteEntity } from "./entities/Route.entity";
import { Car } from "../car/entities/car.entity";
import { UserEntity } from "../user/entities/user.entity";
import { Address } from "../address/entities/address.entity";
import { Event } from "../event/entities/event.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Carpool,
      RouteEntity,
      Car,
      Event,
      UserEntity,
      Address,
    ]),
  ],
  providers: [CarpoolResolver, CarpoolService],
})
export class CarpoolModule {}
