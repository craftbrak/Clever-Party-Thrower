import { Injectable } from "@nestjs/common";
import { CreateCarpoolDto } from "./dto/create-carpool.dto";
import { UpdateCarpoolDto } from "./dto/update-carpool.dto";

@Injectable()
export class CarpoolService {
  //TODO: CRUD
  //TODO: Matching
  create(createCarpoolInput: CreateCarpoolDto) {
    return "This action adds a new carpool";
  }

  findAll() {
    return `This action returns all carpool`;
  }

  findOne(id: string) {
    return `This action returns a #${id} carpool`;
  }

  update(id: string, updateCarpoolInput: UpdateCarpoolDto) {
    return `This action updates a #${id} carpool`;
  }

  remove(id: string) {
    return `This action removes a #${id} carpool`;
  }
}
