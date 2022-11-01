import { InputType, Int, Field, Float, ID } from "@nestjs/graphql";
import { Column, ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";

@InputType()
export class CreateShoppingListItemDto {
  @Field(() => String)
  name: string;
  @Field(() => Float)
  price: number;
  @Field(() => ID)
  @ManyToOne(() => User, { nullable: true })
  assignedId: User["id"];
  @Field(() => Boolean)
  bought: boolean;
  @Field(() => ID)
  eventId: Event["id"];
}
