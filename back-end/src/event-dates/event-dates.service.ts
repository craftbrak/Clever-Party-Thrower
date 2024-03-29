import { Injectable } from "@nestjs/common";
import { CreateEventDateInput } from "./dto/create-event-date.input";
import { UpdateEventDateInput } from "./dto/update-event-date.input";
import { Repository } from "typeorm";
import { EventDate } from "./entities/event-date.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "../event/entities/event.entity";
import { DatesToUser } from "../dates-to-user/entities/dates-to-user.entity";

@Injectable()
export class EventDatesService {
  constructor(
    @InjectRepository(EventDate)
    private readonly eventDateRepo: Repository<EventDate>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(DatesToUser)
    private dateToUserRepo: Repository<DatesToUser>,
  ) {}

  async create(createEventDateInput: CreateEventDateInput) {
    const edate = await this.eventDateRepo.create(createEventDateInput);
    edate.eventId = createEventDateInput.eventId;
    edate.event = await this.eventRepo.findOneBy({
      id: createEventDateInput.eventId,
    });
    return edate.save();
  }

  findAll() {
    return this.eventDateRepo.find({
      relations: {
        datesToUsers: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.eventDateRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        datesToUsers: true,
        event: true,
      },
    });
  }

  async findAllOfEvent(id: string) {
    return this.eventDateRepo.find({
      where: { eventId: id },
      relations: { event: true },
    });
  }

  async update(id: string, updateEventDateInput: UpdateEventDateInput) {
    const out = await this.eventDateRepo.findOne({
      where: { id: updateEventDateInput.id },
    });
    out.numberVotes = updateEventDateInput.numberVotes;
    return await out.save();
  }

  remove(id: string) {
    return this.eventDateRepo.delete({ id: id });
  }

  async getDatesToUsers(eventdateId: string) {
    return (
      await this.eventDateRepo.findOne({
        where: { id: eventdateId },
        relations: {
          datesToUsers: true,
        },
      })
    ).datesToUsers;
  }
}
