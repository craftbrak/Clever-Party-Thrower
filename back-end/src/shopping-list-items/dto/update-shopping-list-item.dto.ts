import { CreateShoppingListItemDto } from "./create-shopping-list-item.dto";
import { InputType, Field, Int, PartialType, Float, ID } from "@nestjs/graphql";
import { ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";

@InputType()
export class UpdateShoppingListItemDto extends PartialType(
  CreateShoppingListItemDto,
) {
  @Field(() => ID)
  id: string;
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
