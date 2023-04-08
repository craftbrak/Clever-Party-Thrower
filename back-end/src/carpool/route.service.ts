import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Carpool } from "./entities/carpool.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Address } from "../address/entities/address.entity";
import { CreateRouteDto } from "./dto/create-route.dto";
import { RouteEntity } from "./entities/Route.entity";
import { UpdateRouteDto } from "./dto/update-route.dto";

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Carpool)
    private readonly carpoolRepository: Repository<Carpool>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    const route = new RouteEntity();
    if (createRouteDto.carpoolId)
      route.carpool = await this.carpoolRepository.findOneByOrFail({
        id: createRouteDto.carpoolId,
      });
    if (createRouteDto.length) route.length = createRouteDto.length;
    if (createRouteDto.pickupId)
      route.pickup = await this.userRepository.findOneByOrFail({
        id: createRouteDto.pickupId,
      });
    if (createRouteDto.destinationId)
      route.destination = await this.addressRepository.findOneByOrFail({
        id: createRouteDto.destinationId,
      });
    if (createRouteDto.startingId)
      route.starting = await this.addressRepository.findOneByOrFail({
        id: createRouteDto.startingId,
      });
    if (createRouteDto.length) route.length = createRouteDto.length;
    if (createRouteDto.departure) route.departure = createRouteDto.departure;
    return this.carpoolRepository.create(route).save();
  }

  async findAll(carpoolId: string = null) {
    if (!carpoolId)
      return this.routeRepository.find({ where: { carpoolId: carpoolId } });
    return this.routeRepository.find();
  }

  async findOne(id: string) {
    return this.routeRepository.findOneByOrFail({ id: id });
  }

  async update(String: string, updateRouteDto: UpdateRouteDto) {
    const route = new RouteEntity();
    if (updateRouteDto.carpoolId)
      route.carpool = await this.carpoolRepository.findOneByOrFail({
        id: updateRouteDto.carpoolId,
      });
    if (updateRouteDto.length) route.length = updateRouteDto.length;
    if (updateRouteDto.pickupId)
      route.pickup = await this.userRepository.findOneByOrFail({
        id: updateRouteDto.pickupId,
      });
    if (updateRouteDto.destinationId)
      route.destination = await this.addressRepository.findOneByOrFail({
        id: updateRouteDto.destinationId,
      });
    if (updateRouteDto.startingId)
      route.starting = await this.addressRepository.findOneByOrFail({
        id: updateRouteDto.startingId,
      });
    if (updateRouteDto.length) route.length = updateRouteDto.length;
    if (updateRouteDto.departure) route.departure = updateRouteDto.departure;
    return route.save();
  }

  remove(id: string) {
    return this.routeRepository.delete({ id });
  }
}
