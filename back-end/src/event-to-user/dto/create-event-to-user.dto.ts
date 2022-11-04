import { Field, InputType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { Address } from "../../address/entities/address.entity";

@InputType()
export class CreateEventToUserDto {
  @Field(() => String)
  userId!: User["id"];

  @Field(() => String)
  eventId!: Event["id"];

  @Field(() => String, { nullable: true })
  addressId: Address["id"];
}
