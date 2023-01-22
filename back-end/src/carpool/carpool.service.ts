import { Injectable } from "@nestjs/common";
import { CreateCarpoolDto } from "./dto/create-carpool.dto";
import { UpdateCarpoolDto } from "./dto/update-carpool.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Carpool } from "./entities/carpool.entity";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Route } from "./entities/Route.entity";
import { Address } from "../address/entities/address.entity";
import { Car } from "../car/entities/car.entity";

@Injectable()
export class CarpoolService {
  // TODO: Matching
  constructor(
    @InjectRepository(Carpool)
    private readonly carpoolRepository: Repository<Carpool>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createCarpoolInput: CreateCarpoolDto) {
    const carpool = new Carpool();
    if (createCarpoolInput.carId)
      carpool.car = await this.carRepository.findOneByOrFail({
        id: createCarpoolInput.carId,
      });
    if (createCarpoolInput.totalLength)
      carpool.totalLength = createCarpoolInput.totalLength;
    if (createCarpoolInput.driverId)
      carpool.driver = await this.userRepository.findOneByOrFail({
        id: createCarpoolInput.driverId,
      });
    if (createCarpoolInput.startDestinationId)
      carpool.startDestination = await this.addressRepository.findOneByOrFail({
        id: createCarpoolInput.startDestinationId,
      });
    if (createCarpoolInput.finalDestinationId)
      carpool.finalDestination = await this.addressRepository.findOneByOrFail({
        id: createCarpoolInput.finalDestinationId,
      });
    if (createCarpoolInput.eventId)
      carpool.event = await this.eventRepository.findOneByOrFail({
        id: createCarpoolInput.eventId,
      });
    if (createCarpoolInput.direction)
      carpool.direction = createCarpoolInput.direction;
    if (createCarpoolInput.arrival)
      carpool.arrival = createCarpoolInput.arrival;
    if (createCarpoolInput.departure)
      carpool.departure = createCarpoolInput.departure;
    return this.carpoolRepository.create(carpool).save();
  }

  async findAll() {
    return await this.carpoolRepository.find();
  }

  async findOne(id: string) {
    return await this.carpoolRepository.findOneByOrFail({ id: id });
  }

  async update(id: string, updateCarpoolInput: UpdateCarpoolDto) {
    const carpool = await this.carpoolRepository.findOneByOrFail({
      id: updateCarpoolInput.id,
    });
    if (updateCarpoolInput.carId)
      carpool.car = await this.carRepository.findOneByOrFail({
        id: updateCarpoolInput.carId,
      });
    if (updateCarpoolInput.totalLength)
      carpool.totalLength = updateCarpoolInput.totalLength;
    if (updateCarpoolInput.driverId)
      carpool.driver = await this.userRepository.findOneByOrFail({
        id: updateCarpoolInput.driverId,
      });
    if (updateCarpoolInput.startDestinationId)
      carpool.startDestination = await this.addressRepository.findOneByOrFail({
        id: updateCarpoolInput.startDestinationId,
      });
    if (updateCarpoolInput.finalDestinationId)
      carpool.finalDestination = await this.addressRepository.findOneByOrFail({
        id: updateCarpoolInput.finalDestinationId,
      });
    if (updateCarpoolInput.direction)
      carpool.direction = updateCarpoolInput.direction;
    if (updateCarpoolInput.arrival)
      carpool.arrival = updateCarpoolInput.arrival;
    if (updateCarpoolInput.departure)
      carpool.departure = updateCarpoolInput.departure;
    return carpool.save();
  }

  async remove(id: string) {
    return await this.carpoolRepository.delete({ id: id });
  }
}
