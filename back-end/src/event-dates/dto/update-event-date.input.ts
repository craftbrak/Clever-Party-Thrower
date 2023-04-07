import { CreateEventDateInput } from "./create-event-date.input";
import { Field, InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateEventDateInput extends PartialType(CreateEventDateInput) {
  @Field(() => String)
  id: string;

  @Field(() => Number)
  numberVotes: number;
}
