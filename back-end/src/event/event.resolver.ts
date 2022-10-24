import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { EventService } from "./event.service";
import { Event } from "./entities/event.entity";
import { CreateEventInput } from "./dto/create-event.input";
import { UpdateEventInput } from "./dto/update-event.input";
import {
  EventsPagination,
  EventsPaginationArgs,
} from "./dto/events.pagination.dto";
import { CurrentUser } from "../auth/guards/jwtAuth.gruard";
import { JWTPayload } from "../auth/auth.service";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";
import { Address } from "../address/entities/address.entity";
import { AddressService } from "../address/address.service";

@Resolver(() => Event)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly addressService: AddressService,
  ) {}

  @Query(() => EventsPagination, { name: "getEvents" })
  async findAll(
    @Args() args: EventsPaginationArgs,
    @CurrentUser() user: JWTPayload,
  ) {
    return await this.eventService.findAll(args);
  }

  @Query(() => Event, { name: "event" })
  async findOne(@Args("id", { type: () => ID }) id: Event["id"]) {
    return this.eventService.findOne(id);
  }

  @Mutation(() => Event)
  async createEvent(
    @Args("createEventInput") createEventInput: CreateEventInput,
    @CurrentUser() user: JWTPayload,
  ) {
    return this.eventService.create(createEventInput);
  }

  @Mutation(() => Event)
  async updateEvent(
    @Args("updateEventInput") updateEventInput: UpdateEventInput,
  ) {
    return this.eventService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => ID)
  async removeEvent(@Args("id", { type: () => ID }) id: Event["id"]) {
    return this.eventService.remove(id);
  }
  @ResolveField("members", () => [EventToUser])
  async members(
    @Parent() event: Event,
    @Args() args: EventsPaginationArgs,
    @CurrentUser() user: JWTPayload,
  ) {
    return await this.eventService.getMembers(args, event);
  }
  @ResolveField("address", () => Address)
  async address(@Parent() event: Event) {
    return this.addressService.findOne(event.addressId);
  }
}
