import { Field, InputType } from "@nestjs/graphql";
import { UserEntity } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { Address } from "../../address/entities/address.entity";
import { OneToMany } from "typeorm";
import { Spending } from "../../spending/entities/spending.entity";

@InputType()
export class CreateEventToUserDto {
  @Field(() => String)
  userId!: UserEntity["id"];

  @Field(() => String)
  eventId!: Event["id"];

  @Field(() => String, { nullable: true })
  addressId: Address["id"];
  @Field(() => [Date], { nullable: true })
  availableDates: Date[];
}
