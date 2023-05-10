import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import {
  EventsPagination,
  EventsPaginationArgs,
} from "./dto/events.pagination.dto";
import { SortDirection } from "../pagination/dto/pagination.dto";
// import { JWTPayload } from "../auth/auth.service";
import { EventToUserService } from "../event-to-user/event-to-user.service";
import { MemberPaginationArgs } from "./dto/eventToUser.pagination.dto";
import { AddressService } from "../address/address.service";
import { JWTPayload } from "../auth/jwtPayload.interface";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    private eventToUserService: EventToUserService,
    private addressService: AddressService,
  ) {}

  async create(input: CreateEventDto): Promise<Event> {
    const event = await this.eventRepo.save(this.eventRepo.create(input));
    event.address = await this.addressService.findOne(input.addressId);
    event.addressId = input.addressId;
    return await event.save();
  }

  async findAll(
    args: EventsPaginationArgs,
    //user: JWTPayload,
  ): Promise<EventsPagination> {
    //TODO: Switch to querry builder and add filter to only see event of user
    const [nodes, totalCount] = await this.eventRepo.findAndCount({
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
        availableDates: true,
        selectedDate: true,
      },
    });
    return { nodes, totalCount };
  }

  async count(user: JWTPayload) {
    return await this.eventRepo.count({
      where: { members: { id: user.id } },
      relations: { members: true },
    });
  }

  async findOne(id: Event["id"]): Promise<Event> {
    return await this.eventRepo.findOneOrFail({
      where: { id: id },
      relations: {
        availableDates: true,
        selectedDate: true,
      },
    });
  }

  async update(
    eventId: Event["id"],
    updateEventInput: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.eventRepo.findOneOrFail({
      where: {
        id: eventId,
      },
    });
    event.name = updateEventInput.name;
    event.total = updateEventInput.total;
    event.description = updateEventInput.description;
    event.selectedDateId = updateEventInput.selectedDateId;
    return await this.eventRepo.save(event);
  }

  async remove(eventId: Event["id"]): Promise<string> {
    await this.eventRepo.remove(
      await this.eventRepo.findOneOrFail({ where: { id: eventId } }),
    );
    return eventId;
  }

  async getMembers(
    args: MemberPaginationArgs,
    event: Event /*user: JWTPayload*/,
  ) {
    return (await this.eventToUserService.findAllOfEvent(args, event)).nodes;
  }

  async getAvailableDates(id: string) {
    return (
      await this.eventRepo.findOne({
        where: { id: id },
        relations: { availableDates: true },
      })
    ).availableDates;
  }

  async getSelectedDate(id: string) {
    return (
      await this.eventRepo.findOne({
        where: { id: id },
        relations: { availableDates: true },
      })
    ).selectedDate;
  }
}
