import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event, EventToUser } from "./entities/event.entity";
import { Repository } from "typeorm";
import { MemberPaginationArgs, MenmberPagination } from "./dto/eventToUser.pagination.dto";
import { JWTPayload } from "../auth/auth.service";
import { SortDirection } from "../pagination/dto/pagination.dto";

@Injectable()
export class EventToUserService {
  constructor(@InjectRepository(EventToUser) private readonly eventToUserRepository: Repository<EventToUser>) {
  }

  async create(input: EventToUser): Promise<EventToUser> {
    return await this.eventToUserRepository.save(input);
  }

  async findAllOfEvent(args: MemberPaginationArgs,event?: Event,): Promise<MenmberPagination> {
    const [nodes, totalCount] = await this.eventToUserRepository.findAndCount({
      skip:args.skip,
      take:args.take,
      order:{
        createdAt:args.sortBy ? args.sortBy.createdAt === SortDirection.ASC ? 'ASC': 'DESC' : 'ASC',
      },
      where:
        { eventId: event.id}
      ,
      relations: {
        user:true,
        event:true
      }
    });
    return { nodes, totalCount };
  }
  async findAllOfUser(user?: JWTPayload,): Promise<EventToUser[]> {
    return await this.eventToUserRepository.find({
      order: {
        createdAt: 'ASC',
      },
      where:
        { userId: user.id }
      ,
      relations: {
        user: true,
        event: true
      }
    });
  }

  async findOne(id: EventToUser["id"]): Promise<EventToUser> {
    return await this.eventToUserRepository.findOneOrFail({ where: { id: id } });
  }

  async update(eventId: EventToUser["id"], input: EventToUser): Promise<EventToUser> {
    const eventToUser = await this.eventToUserRepository.findOneOrFail({
      where: {
        id: eventId
      }
    });
    eventToUser.eventId = input.eventId;
    eventToUser.userId = input.userId;
    return await this.eventToUserRepository.save(eventToUser);
  }

  async remove(eventId: EventToUser["id"]): Promise<String> {
    const event = await this.eventToUserRepository.remove(await this.eventToUserRepository.findOneOrFail({ where: { id: eventId } }));
    return eventId;
  }
}
