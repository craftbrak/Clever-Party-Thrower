import { CreateEventInput } from "./create-event.input";
import { InputType, Field, PartialType, ID, Float } from "@nestjs/graphql";
import { Event } from "../entities/event.entity";

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => ID, { description: "Id of the event" })
  id: Event["id"];

  @Field(() => String, { description: "Name of the event" })
  name: string;

  @Field(() => String, { description: "Description of the event" })
  description: string;

  @Field(() => Float, { description: "Total spent for the event" })
  total: number;
}
