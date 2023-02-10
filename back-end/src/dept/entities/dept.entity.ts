import { Field, Float, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";

@ObjectType()
@Entity()
export class Dept extends Node implements Debt {
  @Field(() => Event)
  @ManyToOne(() => Event)
  event: Event;
  @Field(() => Float)
  @Column({ type: "float" })
  amount: number;
  @Field(() => Boolean)
  @Column({ default: false })
  repayed: boolean;
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  debtor: UserEntity;
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  creditor: UserEntity;
  creditorId: string;
  debtorId: string;
  eventId: string;
}
