import { Injectable } from "@nestjs/common";
import { CreateEventInput } from "./dto/create-event.input";
import { UpdateEventInput } from "./dto/update-event.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { EventsPagination, EventsPaginationArgs } from "./dto/events.pagination.dto";
import { SortDirection } from "../pagination/dto/pagination.dto";

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private readonly eventRepo: Repository<Event> ) {
  }
  async create(input: CreateEventInput) :Promise<Event>{
    return await this.eventRepo.save(this.eventRepo.create(input));
  }

  async findAll(args:EventsPaginationArgs):Promise<EventsPagination> {
    const [nodes,totalCount] =await this.eventRepo.findAndCount({
      skip:args.skip,
      take:args.take,
      order:{
        createdAt:args.sortBy.createdAt === SortDirection.ASC ? 'ASC': 'DESC',
        name:args.sortBy.name === SortDirection.ASC ? 'ASC': 'DESC'
      }
    });
    return {nodes,totalCount}
  }

  async findOne(id: Event['id']) :Promise<Event>{
    return await this.eventRepo.findOneOrFail({where:{id:id}});
  }

  async update(eventId:Event['id'],updateEventInput: UpdateEventInput):Promise<Event> {
    const event = await this.eventRepo.findOneOrFail({
    where:{
      id:eventId
    } });
    event.name = updateEventInput.name
    event.total = updateEventInput.total
    event.description=updateEventInput.description
    return await this.eventRepo.save(event)
  }

  async remove(eventId:Event['id']): Promise<String> {
    const event = await this.eventRepo.remove(await this.eventRepo.findOneOrFail({where: { id:eventId }}));
    return eventId;
  }
}
