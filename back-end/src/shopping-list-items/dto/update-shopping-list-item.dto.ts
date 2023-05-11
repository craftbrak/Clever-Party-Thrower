import { CreateShoppingListItemDto } from "./create-shopping-list-item.dto";
import { Field, Float, InputType, PartialType } from "@nestjs/graphql";
import { ManyToOne } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";

@InputType()
export class UpdateShoppingListItemDto extends PartialType(
  CreateShoppingListItemDto,
) {
  @Field(() => String)
  id: string;
  @Field(() => String, { nullable: true })
  name: string;
  @Field(() => Float, { nullable: true })
  price: number;
  @Field(() => String, { nullable: true })
  @ManyToOne(() => UserEntity, { nullable: true })
  assignedId: UserEntity["id"];
  @Field(() => Boolean, { nullable: true })
  bought: boolean;
  @Field(() => String, { nullable: true })
  eventId: Event["id"];
}
