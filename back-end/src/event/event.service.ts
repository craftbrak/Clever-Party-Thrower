import { Injectable, Logger } from "@nestjs/common";
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
  private readonly logger = new Logger(EventService.name);

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
      relations: {
        availableDates: true,
      },
    });
    event.name = updateEventInput.name;
    event.total = updateEventInput.total;
    event.description = updateEventInput.description;
    if (updateEventInput.selectedDateId !== "") {
      event.fixedDate = true;
      event.selectedDateId = updateEventInput.selectedDateId;
      const date = event.availableDates.find(
        (value) => value.id === updateEventInput.selectedDateId,
      );
      event.selectedDate = date;
      this.logger.log(`updating event with ${updateEventInput.selectedDateId}`);
    }
    if (updateEventInput.addressId) {
      event.addressId = updateEventInput.addressId;
      event.address = await this.addressService.findOne(
        updateEventInput.addressId,
      );
    }
    const out = await this.eventRepo.save(event);
    return out;
  }

  async remove(eventId: Event["id"]): Promise<string> {
    const e = await this.eventRepo.findOneOrFail({
      where: { id: eventId },
      relations: {
        members: true,
        availableDates: true,
        shoppingList: true,
        carpools: true,
        spendings: true,
      },
    });
    const etu = await this.eventToUserService.findAllOfEvent(
      { skip: 0, take: 100000000 },
      e,
    );

    for (const value of etu.nodes) {
      console.log(value.id);
      this.logger.verbose(`Deleting EventToUser ${value.id}`);
      await value.availableDates.forEach((value1) => value1.remove());
      await value.remove();
    }
    e.availableDates?.forEach((value) => value.remove());
    e.carpools.forEach((value) => value.remove());
    e.shoppingList.forEach((value) => value.remove());
    e.spendings.forEach((value) => value.remove());
    e.availableDates.forEach((value) => value.remove());
    this.logger.verbose(`Deleting Event ${e.id}`);
    // await e.remove();
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
        relations: { selectedDate: true },
      })
    ).selectedDate;
  }

  async getshoppingList(id: string) {
    return (
      await this.eventRepo.findOne({
        where: { id: id },
        relations: { shoppingList: true },
      })
    ).shoppingList;
  }
}
