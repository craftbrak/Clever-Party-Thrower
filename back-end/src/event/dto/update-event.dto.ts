import { CreateEventDto } from "./create-event.dto";
import { Field, Float, InputType, PartialType } from "@nestjs/graphql";
import { Event } from "../entities/event.entity";

@InputType()
export class UpdateEventDto extends PartialType(CreateEventDto) {
  @Field(() => String, { description: "Id of the event" })
  id: Event["id"];

  @Field(() => String, { description: "Name of the event" })
  name: string;

  @Field(() => String, { description: "Description of the event" })
  description: string;

  @Field(() => Float, { description: "Total spent for the event" })
  total: number;

  @Field(() => String)
  selectedDateId: string;
}
