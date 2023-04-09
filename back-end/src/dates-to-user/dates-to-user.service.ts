import { Injectable } from "@nestjs/common";
import { CreateDatesToUserInput } from "./dto/create-dates-to-user.input";
import { UpdateDatesToUserInput } from "./dto/update-dates-to-user.input";
import { InjectRepository } from "@nestjs/typeorm";
import { DatesToUser } from "./entities/dates-to-user.entity";
import { Repository } from "typeorm";
import { EventDate } from "../event-dates/entities/event-date.entity";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";

@Injectable()
export class DatesToUserService {
  constructor(
    @InjectRepository(DatesToUser)
    private dateToUserRepo: Repository<DatesToUser>,
    @InjectRepository(EventToUser)
    private eventToUserRepo: Repository<EventToUser>,
    @InjectRepository(EventDate)
    private eventDateRepo: Repository<EventDate>,
  ) {}

  async create(createDatesToUserInput: CreateDatesToUserInput) {
    const eventToUser = await this.eventToUserRepo.findOneBy({
      id: createDatesToUserInput.eventToUserId,
    });
    const eventDate = await this.eventDateRepo.findOneBy({
      id: createDatesToUserInput.eventDateId,
    });

    const dateToUser = await this.dateToUserRepo.create(createDatesToUserInput);
    dateToUser.eventToUser = eventToUser;
    dateToUser.eventDate = eventDate;
    return dateToUser.save();
  }

  findAll() {
    return this.dateToUserRepo.find();
  }

  async findOne(id: string) {
    return await this.dateToUserRepo.findOneBy({ id: id });
  }

  update(id: string, updateDatesToUserInput: UpdateDatesToUserInput) {
    return `This action updates a #${id} datesToUser`;
  }

  remove(id: string) {
    return `This action removes a #${id} datesToUser`;
  }
}
