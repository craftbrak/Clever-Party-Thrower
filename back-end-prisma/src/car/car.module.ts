import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';
import { DbModule } from "../db/db.module";

@Module({
  imports:[DbModule],
  providers: [CarResolver, CarService]
})
export class CarModule {}
