import { Injectable } from "@nestjs/common";
import { CreateEventInput } from "./dto/create-event.input";
import { UpdateEventInput } from "./dto/update-event.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event, EventToUser } from "./entities/event.entity";
import { EventsPagination, EventsPaginationArgs } from "./dto/events.pagination.dto";
import { SortDirection } from "../pagination/dto/pagination.dto";
import { JWTPayload } from "../auth/auth.service";
import { EventToUserService } from "./EventToUser.service";
import { MemberPaginationArgs } from "./dto/eventToUser.pagination.dto";

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private readonly eventRepo: Repository<Event>, private eventToUserService: EventToUserService) {
  }

  async create(input: CreateEventInput, user: JWTPayload): Promise<Event> {
    const event = await this.eventRepo.save(await this.eventRepo.create(input));
    const evToUsr = new EventToUser();
    evToUsr.userId = user.id;
    evToUsr.eventId = event.id;
    await this.eventToUserService.create(evToUsr);
    return await this.eventRepo.save(event);
  }

  async findAll(args: EventsPaginationArgs, user: JWTPayload): Promise<EventsPagination> {
    const [nodes, totalCount] = await this.eventRepo.findAndCount({
      skip: args.skip,
      take: args.take,
      order: {
        createdAt: args.sortBy.createdAt === SortDirection.ASC ? "ASC" : "DESC",
        name: args.sortBy.name === SortDirection.ASC ? "ASC" : "DESC"
      },
      relations: {
        members: true
      }
    });
    return { nodes, totalCount };
  }

  async findOne(id: Event["id"]): Promise<Event> {
    return await this.eventRepo.findOneOrFail({ where: { id: id } });
  }

  async update(eventId: Event["id"], updateEventInput: UpdateEventInput): Promise<Event> {
    const event = await this.eventRepo.findOneOrFail({
      where: {
        id: eventId
      }
    });
    event.name = updateEventInput.name;
    event.total = updateEventInput.total;
    event.description = updateEventInput.description;
    return await this.eventRepo.save(event);
  }

  async remove(eventId: Event["id"]): Promise<String> {
    await this.eventRepo.remove(await this.eventRepo.findOneOrFail({ where: { id: eventId } }));
    return eventId;
  }

  async getMembers(args: MemberPaginationArgs, event: Event, user: JWTPayload) {
    return (await this.eventToUserService.findAllOfEvent(args,event)).nodes;
  }
}
