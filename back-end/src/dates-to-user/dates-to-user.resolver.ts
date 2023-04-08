import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { DatesToUserService } from "./dates-to-user.service";
import { DatesToUser } from "./entities/dates-to-user.entity";
import { CreateDatesToUserInput } from "./dto/create-dates-to-user.input";
import { UpdateDatesToUserInput } from "./dto/update-dates-to-user.input";
import { CurrentUser } from "../auth/current-user.decorator";
import { JWTPayload } from "../auth/jwtPayload.interface";
import { EventDate } from "../event-dates/entities/event-date.entity";
import { EventDatesService } from "../event-dates/event-dates.service";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";
import { EventToUserService } from "../event-to-user/event-to-user.service";

@Resolver(() => DatesToUser)
export class DatesToUserResolver {
  constructor(
    private readonly datesToUserService: DatesToUserService,
    private readonly eventDateService: EventDatesService,
    private readonly evntToUserService: EventToUserService,
  ) {}

  @Mutation(() => DatesToUser)
  createDatesToUser(
    @Args("createDatesToUserInput")
    createDatesToUserInput: CreateDatesToUserInput,
  ) {
    return this.datesToUserService.create(createDatesToUserInput);
  }

  @Query(() => [DatesToUser], { name: "datesToUser" })
  async findAll(@CurrentUser() user: JWTPayload) {
    const dateToUser = await this.datesToUserService.findAll();
    console.log(dateToUser);
    return dateToUser;
  }

  @Query(() => DatesToUser, { name: "datesToUser" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.datesToUserService.findOne(id);
  }

  @Mutation(() => DatesToUser)
  updateDatesToUser(
    @Args("updateDatesToUserInput")
    updateDatesToUserInput: UpdateDatesToUserInput,
  ) {
    return this.datesToUserService.update(
      updateDatesToUserInput.id,
      updateDatesToUserInput,
    );
  }

  @Mutation(() => DatesToUser)
  removeDatesToUser(@Args("id", { type: () => String }) id: string) {
    return this.datesToUserService.remove(id);
  }

  @ResolveField("eventDate", () => EventDate)
  async eventDate(@Parent() dateToUser: DatesToUser) {
    const out = await this.eventDateService.findOne(dateToUser.eventDateId);
    return out;
  }

  @ResolveField("eventToUser", () => EventToUser)
  async eventToUser(@Parent() dateToUser: DatesToUser) {
    const out = await this.evntToUserService.findOne(dateToUser.eventToUserId);
    return out;
  }
}
