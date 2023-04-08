import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CarpoolService } from "./carpool.service";
import { Carpool } from "./entities/carpool.entity";
import { CreateCarpoolDto } from "./dto/create-carpool.dto";
import { UpdateCarpoolDto } from "./dto/update-carpool.dto";
import { Address } from "../address/entities/address.entity";
import { UserService } from "../user/user.service";
import { AddressService } from "../address/address.service";
import { UserEntity } from "../user/entities/user.entity";
import { RouteEntity } from "./entities/Route.entity";
import { RouteService } from "./route.service";
import { Car } from "../car/entities/car.entity";
import { CarService } from "../car/car.service";
import { EventService } from "../event/event.service";

@Resolver(() => Carpool)
export class CarpoolResolver {
  constructor(
    private readonly carpoolService: CarpoolService,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly routeService: RouteService,
    private readonly carService: CarService,
    private readonly eventService: EventService,
  ) {}

  @Mutation(() => Carpool)
  createCarpool(
    @Args("createCarpoolInput") createCarpoolInput: CreateCarpoolDto,
  ) {
    return this.carpoolService.create(createCarpoolInput);
  }

  @Query(() => [Carpool], { name: "carpools" })
  findAll() {
    return this.carpoolService.findAll();
  }

  @Query(() => Carpool, { name: "carpool" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.carpoolService.findOne(id);
  }

  @Mutation(() => Carpool)
  updateCarpool(
    @Args("updateCarpoolInput") updateCarpoolInput: UpdateCarpoolDto,
  ) {
    return this.carpoolService.update(
      updateCarpoolInput.id,
      updateCarpoolInput,
    );
  }

  @Mutation(() => Carpool)
  removeCarpool(@Args("id", { type: () => String }) id: string) {
    return this.carpoolService.remove(id);
  }

  @ResolveField("driver", () => UserEntity)
  async driver(@Parent() carpool: Carpool) {
    return this.userService.findOneById(carpool.driverId);
  }

  @ResolveField("endPoint", () => Address)
  async endPoint(@Parent() carpool: Carpool) {
    return this.addressService.findOne(carpool.endPointId);
  }

  @ResolveField("startPoint", () => Address)
  async startPoint(@Parent() carpool: Carpool) {
    return this.addressService.findOne(carpool.startPointId);
  }

  @ResolveField("routes", () => [RouteEntity])
  async routes(@Parent() carpool: Carpool) {
    return this.routeService.findAll(carpool.id);
  }

  @ResolveField("car", () => Car)
  async car(@Parent() carpool: Carpool) {
    return this.carService.findOne(carpool.carId);
  }

  @ResolveField("event", () => Event)
  async event(@Parent() carpool: Carpool) {
    return this.eventService.findOne(carpool.eventId);
  }
}
