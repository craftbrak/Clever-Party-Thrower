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
import { UserModule } from "../user/user.module";
import { EventModule } from "../event/event.module";
import { AddressModule } from "../address/address.module";
import { RouteResolver } from "./route.resolver";
import { RouteService } from "./route.service";
import { CarModule } from "../car/car.module";

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
    UserModule,
    EventModule,
    AddressModule,
    CarModule,
  ],
  providers: [CarpoolResolver, CarpoolService, RouteResolver, RouteService],
})
export class CarpoolModule {}
