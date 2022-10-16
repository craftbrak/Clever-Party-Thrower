import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CarService } from './car.service';
import { CreateCarInput } from './dto/create-car.input';
import { UpdateCarInput } from './dto/update-car.input';

@Resolver('Car')
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Mutation('createCar')
  create(@Args('createCarInput') createCarInput: CreateCarInput) {
    return this.carService.create(createCarInput);
  }

  @Query('car')
  findAll(userId:number) {
    return this.carService.findAll(userId);
  }

  @Query('car')
  findOne(@Args('id') id: number) {
    return this.carService.findOne(id);
  }

  @Mutation('updateCar')
  update(@Args('updateCarInput') updateCarInput: UpdateCarInput) {
    return this.carService.update(updateCarInput.id, updateCarInput);
  }

  @Mutation('removeCar')
  remove(@Args('id') id: number) {
    return this.carService.remove(id);
  }
}
