import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { EventDatesService } from "./event-dates.service";
import { EventDate } from "./entities/event-date.entity";
import { CreateEventDateInput } from "./dto/create-event-date.input";
import { UpdateEventDateInput } from "./dto/update-event-date.input";
import { EventService } from "../event/event.service";

@Resolver(() => EventDate)
export class EventDatesResolver {
  constructor(
    private readonly eventDatesService: EventDatesService,
    private readonly eventService: EventService,
  ) {}

  @Mutation(() => EventDate)
  createEventDate(
    @Args("createEventDateInput") createEventDateInput: CreateEventDateInput,
  ) {
    return this.eventDatesService.create(createEventDateInput);
  }

  @Query(() => [EventDate], { name: "eventDates" })
  findAll() {
    return this.eventDatesService.findAll();
  }

  @Query(() => EventDate, { name: "eventDate" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.eventDatesService.findOne(id);
  }

  @Mutation(() => EventDate)
  updateEventDate(
    @Args("updateEventDateInput") updateEventDateInput: UpdateEventDateInput,
  ) {
    return this.eventDatesService.update(
      updateEventDateInput.id,
      updateEventDateInput,
    );
  }

  @Mutation(() => EventDate)
  removeEventDate(@Args("id", { type: () => String }) id: string) {
    return this.eventDatesService.remove(id);
  }

  @ResolveField("event", () => Event)
  async event(@Parent() eventDate: EventDate) {
    return this.eventService.findOne(eventDate.eventId);
  }

  @ResolveField("datesToUsers", () => Event)
  async datesToUsers(@Parent() eventDate: EventDate) {
    return await this.eventDatesService.getDatesToUsers(eventDate.id);
  }
}
