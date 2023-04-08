import { Field, Float, InputType } from "@nestjs/graphql";

@InputType()
export class CreateEventDto {
  @Field(() => String, { description: "Name of the event" })
  name: string;

  @Field(() => String, { description: "Description of the event" })
  description: string;

  @Field(() => Float, { description: "Total spent for the event" })
  total: number;

  @Field(() => String)
  addressId: string;

  @Field(() => Boolean)
  fixedDate: boolean;
}
