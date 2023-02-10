import { InputType, Int, Field, Float, ID } from "@nestjs/graphql";
import { UserEntity } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";

@InputType()
export class CreateDeptInput {
  @Field(() => ID)
  eventId: string;
  @Field(() => Float)
  amount: number;

  @Field(() => ID)
  debtorId: string;
  @Field(() => ID)
  creditorId: string;
  creditor: UserEntity;
  event: Event;
  debtor: UserEntity;
}
