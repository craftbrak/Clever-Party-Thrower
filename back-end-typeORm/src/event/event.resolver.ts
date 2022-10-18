import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EventService } from "./event.service";
import { Event } from "./entities/event.entity";
import { CreateEventInput } from "./dto/create-event.input";
import { UpdateEventInput } from "./dto/update-event.input";
import { EventsPagination, EventsPaginationArgs } from "./dto/events.pagination.dto";

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {
  }

  @Query(() => EventsPagination, { name: "events" })
  async findAll(@Args() args:EventsPaginationArgs) {
    const test= await this.eventService.findAll(args)
    return test;
  }

  @Query(() => Event, { name: "event" })
  async findOne(@Args("id", { type: () => ID }) id: Event['id']) {
    return this.eventService.findOne(id);
  }

  @Mutation(() => Event)
  async createEvent(@Args("createEventInput") createEventInput: CreateEventInput) {
    return this.eventService.create(createEventInput);
  }

  @Mutation(() => Event)
  async updateEvent(@Args("updateEventInput") updateEventInput: UpdateEventInput) {
    return this.eventService.update(updateEventInput.id,updateEventInput);
  }

  @Mutation(() => ID)
  async removeEvent(@Args("id", { type: () => ID   }) id: Event['id']) {
    return this.eventService.remove(id);
  }
}
