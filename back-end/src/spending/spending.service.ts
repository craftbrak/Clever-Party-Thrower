import { Injectable } from '@nestjs/common';
import { CreateSpendingInput } from './dto/create-spending.input';
import { UpdateSpendingInput } from './dto/update-spending.input';

@Injectable()
export class SpendingService {
  //TODO: CRUD
  //TODO: matching
  create(createSpendingInput: CreateSpendingInput) {
    return 'This action adds a new spending';
  }

  findAll() {
    return `This action returns all spending`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spending`;
  }

  update(id: number, updateSpendingInput: UpdateSpendingInput) {
    return `This action updates a #${id} spending`;
  }

  remove(id: number) {
    return `This action removes a #${id} spending`;
  }
}
