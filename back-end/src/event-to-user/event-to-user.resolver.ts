import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { EventToUserService } from "./event-to-user.service";
import { EventToUser } from "./entities/event-to-user.entity";
import { CreateEventToUserDto } from "./dto/create-event-to-user.dto";
import { UpdateEventToUserDto } from "./dto/update-event-to-user.dto";
import { UserEntity } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Address } from "../address/entities/address.entity";
import { CurrentUser } from "../auth/current-user.decorator";
import { JWTPayload } from "../auth/jwtPayload.interface";

@Resolver(() => EventToUser)
export class EventToUserResolver {
  constructor(private readonly eventToUserService: EventToUserService) {}

  @Mutation(() => EventToUser)
  async createEventToUser(
    @Args("createEventToUserInput")
    createEventToUserInput: CreateEventToUserDto,
  ) {
    return await this.eventToUserService.create(createEventToUserInput);
  }

  @Query(() => Int, { name: "countEvents" })
  async count(@CurrentUser() user: JWTPayload) {
    return this.eventToUserService.countEvents(user);
  }

  @Query(() => EventToUser, { name: "eventToUser" })
  async findOne(@Args("id", { type: () => String }) id: string) {
    return await this.eventToUserService.findOne(id);
  }

  @Mutation(() => EventToUser)
  async updateEventToUser(
    @Args("updateEventToUserInput")
    updateEventToUserInput: UpdateEventToUserDto,
  ) {
    return await this.eventToUserService.update(
      updateEventToUserInput.id,
      updateEventToUserInput,
    );
  }

  @Mutation(() => EventToUser)
  async removeEventToUser(@Args("id", { type: () => String }) id: string) {
    return await this.eventToUserService.remove(id);
  }

  @ResolveField("user", () => UserEntity)
  async getUser(@Parent() eventToUser: EventToUser) {
    const e = await this.eventToUserService.findOne(eventToUser.id);
    return e.user;
  }

  @ResolveField("event", () => Event)
  async getEvent(@Parent() eventToUser: EventToUser) {
    const e = await this.eventToUserService.findOne(eventToUser.id);
    return e.event;
  }

  @ResolveField("address", () => Address)
  async getAddress(@Parent() eventToUser: EventToUser) {
    const e = await this.eventToUserService.findOne(eventToUser.id);
    return e.address;
  }
}
