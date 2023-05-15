import { Field, Float, ID, InputType } from "@nestjs/graphql";
import { UserEntity } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

@InputType()
export class CreateDeptInput {
  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  eventId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Field(() => Float)
  amount: number;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  debtorId: string;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  creditorId: string;
  creditor: UserEntity;
  event: Event;
  debtor: UserEntity;
}
