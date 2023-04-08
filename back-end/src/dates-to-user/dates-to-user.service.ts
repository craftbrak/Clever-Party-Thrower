import { Injectable } from "@nestjs/common";
import { CreateDatesToUserInput } from "./dto/create-dates-to-user.input";
import { UpdateDatesToUserInput } from "./dto/update-dates-to-user.input";
import { InjectRepository } from "@nestjs/typeorm";
import { DatesToUser } from "./entities/dates-to-user.entity";
import { Repository } from "typeorm";

@Injectable()
export class DatesToUserService {
  constructor(
    @InjectRepository(DatesToUser)
    private dateToUserRepo: Repository<DatesToUser>,
  ) {}

  create(createDatesToUserInput: CreateDatesToUserInput) {
    const dateToUser = this.dateToUserRepo.create(createDatesToUserInput);
    dateToUser.eventToUserId = createDatesToUserInput.eventToUserId;
    dateToUser.eventDateId = createDatesToUserInput.eventDateId;
    return dateToUser.save();
  }

  findAll() {
    return this.dateToUserRepo.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} datesToUser`;
  }

  update(id: string, updateDatesToUserInput: UpdateDatesToUserInput) {
    return `This action updates a #${id} datesToUser`;
  }

  remove(id: string) {
    return `This action removes a #${id} datesToUser`;
  }
}
