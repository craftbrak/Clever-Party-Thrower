import { Injectable } from "@nestjs/common";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Car } from "./entities/car.entity";
import { JWTPayload } from "../auth/jwtPayload.interface";
import { User } from "../user/entities/user.entity";

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(createCarInput: CreateCarDto, user: User) {
    createCarInput.ownerId = user.id;
    createCarInput.owner = await this.userRepo.findOneByOrFail({ id: user.id });
    return this.carRepo.create(createCarInput).save();
  }

  async findAll() {
    return this.carRepo.find(); //todo: find only cars of auth user
  }

  async findOne(id: string) {
    return this.carRepo.findOneByOrFail({ id });
  }

  async update(id: string, updateCarInput: UpdateCarDto) {
    return this.carRepo.update(id, updateCarInput);
  }

  async remove(id: string) {
    return this.carRepo.delete(id);
  }

  async getOwner(car: Car) {
    return this.userRepo.findOneByOrFail({ id: car.ownerId });
  }
}
