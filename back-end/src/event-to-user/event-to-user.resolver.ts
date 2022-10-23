import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { EventToUserService } from "./event-to-user.service";
import { EventToUser } from "./entities/event-to-user.entity";
import { CreateEventToUserInput } from "./dto/create-event-to-user.input";
import { UpdateEventToUserInput } from "./dto/update-event-to-user.input";

@Resolver(() => EventToUser)
export class EventToUserResolver {
  constructor(private readonly eventToUserService: EventToUserService) {}

  @Mutation(() => EventToUser)
  createEventToUser(
    @Args("createEventToUserInput")
    createEventToUserInput: CreateEventToUserInput,
  ) {
    return this.eventToUserService.create(createEventToUserInput);
  }

  @Query(() => EventToUser, { name: "eventToUser" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.eventToUserService.findOne(id);
  }

  @Mutation(() => EventToUser)
  updateEventToUser(
    @Args("updateEventToUserInput")
    updateEventToUserInput: UpdateEventToUserInput,
  ) {
    return this.eventToUserService.update(
      updateEventToUserInput.id,
      updateEventToUserInput,
    );
  }

  @Mutation(() => EventToUser)
  removeEventToUser(@Args("id", { type: () => String }) id: string) {
    return this.eventToUserService.remove(id);
  }
}
