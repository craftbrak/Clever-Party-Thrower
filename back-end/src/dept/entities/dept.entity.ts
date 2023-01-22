import { Field, Float, ObjectType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";

@ObjectType()
@Entity()
export class Dept extends Node {
  @Field(() => Event)
  @ManyToOne(() => Event)
  event: Event;
  @Field(() => Float)
  @Column({ type: "float" })
  amount: number;
  @Field(() => Boolean)
  @Column({ default: false })
  repayed: boolean;
  @Field(() => User)
  @ManyToOne(() => User)
  debtee: User;
  @Field(() => User)
  @ManyToOne(() => User)
  lender: User;
}
