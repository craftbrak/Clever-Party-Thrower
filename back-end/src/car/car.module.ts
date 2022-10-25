import { Module } from "@nestjs/common";
import { CarService } from "./car.service";
import { CarResolver } from "./car.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Car } from "./entities/car.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  providers: [CarResolver, CarService],
})
export class CarModule {}
