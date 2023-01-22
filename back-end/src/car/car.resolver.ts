import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CarService } from "./car.service";
import { Car } from "./entities/car.entity";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";
import { CurrentUser } from "../auth/current-user.decorator";
import { JWTPayload } from "../auth/jwtPayload.interface";
import { User } from "../user/entities/user.entity";

@Resolver(() => Car)
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Mutation(() => Car)
  async createCar(
    @Args("createCarInput") createCarInput: CreateCarDto,
    @CurrentUser() user: User,
  ) {
    return await this.carService.create(createCarInput, user);
  }

  @Query(() => [Car], { name: "car" })
  async findAll() {
    return await this.carService.findAll();
  }

  @Query(() => Car, { name: "car" })
  async findOne(@Args("id", { type: () => String }) id: string) {
    return await this.carService.findOne(id);
  }

  @Mutation(() => Car)
  async updateCar(@Args("updateCarInput") updateCarInput: UpdateCarDto) {
    return await this.carService.update(updateCarInput.id, updateCarInput);
  }

  @Mutation(() => Car)
  async removeCar(@Args("id", { type: () => String }) id: string) {
    return await this.carService.remove(id);
  }

  @ResolveField("owner", () => User)
  async findOwner(@Parent() car: Car) {
    return await this.carService.getOwner(car);
  }
}
