import { Field, Float, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
import { Address } from "../../address/entities/address.entity";
import { EventToUser } from "./eventToUser.entity";

@ObjectType()
@Entity()
export class Event extends Node {
  @Column()
  @Field(() => String, { description: "Name of the event" })
  name: string;
  @Column()
  @Field(() => String, { description: "Description of the event" })
  description: string;
  @Column({ type: "float" })
  @Field(() => Float, { description: "Total spent for the event" })
  total: number;
  @Field(() => [EventToUser], { nullable: true })
  @OneToMany(() => EventToUser, (eventToUser) => eventToUser.user)
  members: EventToUser[];
  @Field(() => Address, { nullable: true })
  @ManyToOne(() => Address)
  @JoinColumn([{ name: "addressId", referencedColumnName: "id" }])
  address: Address;
  @Field(() => String, { nullable: true })
  @RelationId((self: Event) => self.address)
  readonly addressId: Address["id"];
}
