import { Injectable } from "@nestjs/common";
import { CreateCarInput } from "./dto/create-car.input";
import { UpdateCarInput } from "./dto/update-car.input";

@Injectable()
export class CarService {
  create(createCarInput: CreateCarInput) {
    return "This action adds a new car";
  }

  findAll() {
    return `This action returns all car`;
  }

  findOne(id: string) {
    return `This action returns a #${id} car`;
  }

  update(id: string, updateCarInput: UpdateCarInput) {
    return `This action updates a #${id} car`;
  }

  remove(id: string) {
    return `This action removes a #${id} car`;
  }
}
