import { Module } from "@nestjs/common";
import { CarService } from "./car.service";
import { CarResolver } from "./car.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Car } from "./entities/car.entity";
import { User } from "../user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Car, User])],
  providers: [CarResolver, CarService],
})
export class CarModule {}
