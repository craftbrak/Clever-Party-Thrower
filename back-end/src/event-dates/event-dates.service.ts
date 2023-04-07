import { Injectable } from "@nestjs/common";
import { CreateEventDateInput } from "./dto/create-event-date.input";
import { UpdateEventDateInput } from "./dto/update-event-date.input";
import { Repository } from "typeorm";
import { EventDate } from "./entities/event-date.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class EventDatesService {
  constructor(
    @InjectRepository(EventDate)
    private readonly eventDateRepo: Repository<EventDate>,
  ) {}

  create(createEventDateInput: CreateEventDateInput) {
    const edate = this.eventDateRepo.create(createEventDateInput);
    edate.eventId = createEventDateInput.eventId;
    return edate.save();
  }

  findAll() {
    return this.eventDateRepo.find();
  }

  findOne(id: string) {
    return this.eventDateRepo.findBy({ id: id });
  }

  update(id: string, updateEventDateInput: UpdateEventDateInput) {
    return this.eventDateRepo.update(
      { id: updateEventDateInput.id },
      updateEventDateInput,
    );
  }

  remove(id: string) {
    return this.eventDateRepo.delete({ id: id });
  }
}
