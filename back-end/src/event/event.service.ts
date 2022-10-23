import { Injectable } from "@nestjs/common";
import { CreateEventInput } from "./dto/create-event.input";
import { UpdateEventInput } from "./dto/update-event.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import {
  EventsPagination,
  EventsPaginationArgs,
} from "./dto/events.pagination.dto";
import { SortDirection } from "../pagination/dto/pagination.dto";
import { JWTPayload } from "../auth/auth.service";
import { EventToUserService } from "../event-to-user/event-to-user.service";
import { MemberPaginationArgs } from "./dto/eventToUser.pagination.dto";
import { AddressService } from "../address/address.service";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    private eventToUserService: EventToUserService,
    private addressService: AddressService,
  ) {}

  async create(input: CreateEventInput): Promise<Event> {
    const event = await this.eventRepo.save(this.eventRepo.create(input));
    event.address = await this.addressService.findOne(input.addressId);
    event.addressId = input.addressId;
    return await event.save();
  }

  async findAll(
    args: EventsPaginationArgs,
    user: JWTPayload,
  ): Promise<EventsPagination> {
    const [nodes, totalCount] = await this.eventRepo.findAndCount({
      where: {
        members: {
          userId: user.id,
        },
      },
      skip: args.skip,
      take: args.take,
      order: {
        createdAt: args.sortBy
          ? args.sortBy.createdAt === SortDirection.ASC
            ? "ASC"
            : "DESC"
          : "ASC",
        name: args.sortBy
          ? args.sortBy.name === SortDirection.ASC
            ? "ASC"
            : "DESC"
          : "ASC",
      },
      relations: {
        members: true,
      },
    });
    return { nodes, totalCount };
  }

  async findOne(id: Event["id"]): Promise<Event> {
    return await this.eventRepo.findOneOrFail({ where: { id: id } });
  }

  async update(
    eventId: Event["id"],
    updateEventInput: UpdateEventInput,
  ): Promise<Event> {
    const event = await this.eventRepo.findOneOrFail({
      where: {
        id: eventId,
      },
    });
    event.name = updateEventInput.name;
    event.total = updateEventInput.total;
    event.description = updateEventInput.description;
    return await this.eventRepo.save(event);
  }

  async remove(eventId: Event["id"]): Promise<string> {
    await this.eventRepo.remove(
      await this.eventRepo.findOneOrFail({ where: { id: eventId } }),
    );
    return eventId;
  }

  async getMembers(args: MemberPaginationArgs, event: Event, user: JWTPayload) {
    return (await this.eventToUserService.findAllOfEvent(args, event)).nodes;
  }
}
