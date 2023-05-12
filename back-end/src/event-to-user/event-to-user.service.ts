import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "../event/entities/event.entity";
import { DeleteResult, Repository } from "typeorm";
import {
  MemberPaginationArgs,
  MenmberPagination,
} from "../event/dto/eventToUser.pagination.dto";
import { JWTPayload } from "../auth/jwtPayload.interface";
import { SortDirection } from "../pagination/dto/pagination.dto";
import { EventToUser } from "./entities/event-to-user.entity";
import { CreateEventToUserDto } from "./dto/create-event-to-user.dto";
import { UpdateEventToUserDto } from "./dto/update-event-to-user.dto";
import { AddressService } from "../address/address.service";

@Injectable()
export class EventToUserService {
  constructor(
    @InjectRepository(EventToUser)
    private readonly eventToUserRepository: Repository<EventToUser>,
    private addressService: AddressService,
  ) {}

  async create(input: CreateEventToUserDto): Promise<EventToUser> {
    const etoU = new EventToUser();
    etoU.userId = input.userId;
    etoU.eventId = input.eventId;
    etoU.address = await this.addressService.findOne(input.addressId);
    etoU.role = input.role;
    return await this.eventToUserRepository.save(
      await this.eventToUserRepository.create(etoU),
    );
  }

  async countMembers(event: Event) {
    return await this.eventToUserRepository.count({
      where: { eventId: event.id },
    });
  }

  async countEvents(user: JWTPayload) {
    return await this.eventToUserRepository.count({
      where: { userId: user.id },
    });
  }

  async findAllOfEvent(
    args: MemberPaginationArgs,
    event?: Event,
  ): Promise<MenmberPagination> {
    const [nodes, totalCount] = await this.eventToUserRepository.findAndCount({
      skip: args.skip,
      take: args.take,
      order: {
        createdAt: args.sortBy
          ? args.sortBy.createdAt === SortDirection.ASC
            ? "ASC"
            : "DESC"
          : "ASC",
      },
      where: { eventId: event.id },
      relations: {
        user: true,
        event: true,
        availableDates: true,
      },
    });
    return { nodes, totalCount };
  }

  async findAllOfUser(user?: JWTPayload): Promise<EventToUser[]> {
    return await this.eventToUserRepository.find({
      order: {
        createdAt: "ASC",
      },
      where: { userId: user.id },
      relations: {
        user: true,
        event: true,
        address: true,
        availableDates: true,
      },
    });
  }

  async findOne(id: EventToUser["id"]): Promise<EventToUser> {
    return await this.eventToUserRepository.findOneOrFail({
      where: { id: id },
      relations: {
        user: true,
        event: true,
        address: true,
        availableDates: true,
      },
    });
  }

  async update(
    eventId: EventToUser["id"],
    input: UpdateEventToUserDto,
  ): Promise<EventToUser> {
    const eventToUser = await this.eventToUserRepository.findOneOrFail({
      where: {
        id: eventId,
      },
    });
    eventToUser.role = input.role;
    eventToUser.eventId = input.eventId;
    eventToUser.userId = input.userId;
    eventToUser.addressId = input.addressId;
    return await this.eventToUserRepository.save(eventToUser);
  }

  async remove(eventId: EventToUser["id"]): Promise<DeleteResult> {
    return await this.eventToUserRepository.delete({ id: eventId });
  }
}
