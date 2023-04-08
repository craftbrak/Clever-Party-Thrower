import { Field, InputType, Int } from "@nestjs/graphql";
import { EventDate } from "../../event-dates/entities/event-date.entity";

@InputType()
export class CreateDatesToUserInput {
  @Field(() => String)
  eventDateId: EventDate["id"];
  @Field(() => String)
  eventToUserId: string;
  @Field(() => Int)
  voteValue: number;
}
