import { Injectable } from '@nestjs/common';
import { CreateDatesToUserInput } from './dto/create-dates-to-user.input';
import { UpdateDatesToUserInput } from './dto/update-dates-to-user.input';

@Injectable()
export class DatesToUserService {
  create(createDatesToUserInput: CreateDatesToUserInput) {
    return 'This action adds a new datesToUser';
  }

  findAll() {
    return `This action returns all datesToUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} datesToUser`;
  }

  update(id: number, updateDatesToUserInput: UpdateDatesToUserInput) {
    return `This action updates a #${id} datesToUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} datesToUser`;
  }
}
