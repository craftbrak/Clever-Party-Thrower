import { ObjectType, Field, Int, Float } from "@nestjs/graphql";
import { Node } from "../../pagination/entities/node.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Event } from "../../event/entities/event.entity";

@ObjectType()
@Entity()
export class ShoppingListItem extends Node {
  @Field(() => String)
  @Column()
  name: string;
  @Field(() => Float)
  @Column({ type: "float" })
  price: number;
  @Field(() => User)
  @ManyToOne(() => User, { nullable: true })
  assigned: User;
  @Field(() => Boolean)
  @Column()
  bought: boolean;
  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.shoppingList)
  event: Event;
}
