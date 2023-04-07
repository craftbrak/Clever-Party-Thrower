import { Field, InputType, Int } from "@nestjs/graphql";
import { EventDate } from "../../event-dates/entities/event-date.entity";

@InputType()
export class CreateDatesToUserInput {
  @Field(() => Int, { description: "Example field (placeholder)" })
  exampleField: number;
  @Field(() => String)
  eventDateId: EventDate["id"];
  @Field(() => String)
  userId: string;
}
