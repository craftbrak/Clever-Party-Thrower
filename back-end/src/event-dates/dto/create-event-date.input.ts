import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateEventDateInput {
  @Field(() => Date)
  date: Date;
  @Field(() => String)
  eventId: string;
}
