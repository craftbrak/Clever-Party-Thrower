import { Injectable, Logger } from "@nestjs/common";
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
import { ShoppingListItemsService } from "../shopping-list-items/shopping-list-items.service";

@Injectable()
export class EventToUserService {
  private readonly logger = new Logger(EventToUserService.name);

  constructor(
    @InjectRepository(EventToUser)
    private readonly eventToUserRepository: Repository<EventToUser>,
    private addressService: AddressService,
    private shoppingListService: ShoppingListItemsService,
  ) {}

  async create(input: CreateEventToUserDto): Promise<EventToUser> {
    //first we should verfiy if the user is already in the event if yes the return the EventToUser
    const etu = await this.eventToUserRepository.findOne({
      where: {
        userId: input.userId,
        eventId: input.eventId,
      },
    });
    if (etu) {
      this.logger.verbose("UserToEvent Already existed");
      return etu;
    }
    const etoU = new EventToUser();
    etoU.userId = input.userId;
    etoU.eventId = input.eventId;
    etoU.address = await this.addressService.findOne(input.addressId);
    etoU.role = input.role;
    etoU.balance = input.balance;
    this.logger.verbose(
      `Event To User Added for Event: ${input.eventId} and User : ${input.userId}`,
    );
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
    if (input.role) {
      eventToUser.role = input.role;
    }
    if (input.eventId) {
      eventToUser.eventId = input.eventId;
    }
    if (input.userId) {
      eventToUser.userId = input.userId;
    }
    if (input.addressId) {
      eventToUser.addressId = input.addressId;
    }
    if (input.balance) {
      eventToUser.balance = input.balance;
    }
    await eventToUser.save();
    await this.shoppingListService.updateShoppingListSpending(
      eventToUser.eventId,
    );
    return eventToUser;
  }

  async remove(eventId: EventToUser["id"]): Promise<DeleteResult> {
    return await this.eventToUserRepository.delete({ id: eventId });
  }
}
