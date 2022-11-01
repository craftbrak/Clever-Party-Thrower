import { Injectable } from "@nestjs/common";
import { CreateSpendingDto } from "./dto/create-spending.dto";
import { UpdateSpendingDto } from "./dto/update-spending.dto";

@Injectable()
export class SpendingService {
  //TODO: CRUD
  //TODO: matching
  create(createSpendingInput: CreateSpendingDto) {
    return "This action adds a new spending";
  }

  findAll() {
    return `This action returns all spending`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spending`;
  }

  update(id: number, updateSpendingInput: UpdateSpendingDto) {
    return `This action updates a #${id} spending`;
  }

  remove(id: number) {
    return `This action removes a #${id} spending`;
  }
}
