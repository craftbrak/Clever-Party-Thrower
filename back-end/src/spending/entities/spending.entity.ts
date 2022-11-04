import { Field, Float, ObjectType } from "@nestjs/graphql";
import { Node } from "../../pagination/entities/node.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { ShoppingListItem } from "../../shopping-list-items/entities/shopping-list-item.entity";

@ObjectType()
@Entity()
export class Spending extends Node {
  @Field(() => User)
  @ManyToOne(() => User)
  buyer: User;

  @Field(() => Event)
  @ManyToOne(() => Event)
  event: Event;

  @Field(() => Float)
  @Column()
  value: number;

  @Field(() => ShoppingListItem)
  @ManyToOne(() => ShoppingListItem, { nullable: true })
  shoppingListItem: ShoppingListItem;
  //TODO: DTO
}
