import { Field, Float, ObjectType } from "@nestjs/graphql";
import { Node } from "../../pagination/entities/node.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { ShoppingListItem } from "../../shopping-list-items/entities/shopping-list-item.entity";

@ObjectType()
@Entity()
export class Spending extends Node {
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  buyer: UserEntity;

  @Field(() => Event)
  @ManyToOne(() => Event)
  event: Event;

  @Field(() => Float)
  @Column({ type: "float" })
  value: number;

  @Field(() => ShoppingListItem)
  @ManyToOne(() => ShoppingListItem, { nullable: true })
  shoppingListItem: ShoppingListItem;
}
