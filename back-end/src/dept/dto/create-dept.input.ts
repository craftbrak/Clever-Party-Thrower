import { InputType, Int, Field, Float, ID } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";

@InputType()
export class CreateDeptInput {
  @Field(() => ID)
  eventId: string;
  @Field(() => Float)
  amount: number;

  @Field(() => ID)
  debteeId: string;
  @Field(() => ID)
  lenderId: string;
  lender: User;
  event: Event;
  deptee: User;
}
