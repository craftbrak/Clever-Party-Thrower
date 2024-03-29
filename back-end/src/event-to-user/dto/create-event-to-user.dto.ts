import { Field, Float, InputType } from "@nestjs/graphql";
import { UserEntity } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { Address } from "../../address/entities/address.entity";
import { UserRole } from "../entities/event-to-user.entity";

@InputType()
export class CreateEventToUserDto {
  @Field(() => String)
  userId!: UserEntity["id"];

  @Field(() => String)
  eventId!: Event["id"];

  @Field(() => String, { nullable: true })
  addressId: Address["id"];

  @Field(() => UserRole, { nullable: true, defaultValue: UserRole.INVITED })
  role?: UserRole;
  @Field(() => Float, { defaultValue: 0 })
  balance: number;
}
