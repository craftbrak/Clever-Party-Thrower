import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
import { User } from "../../user/entities/user.entity";
import { Event } from "./event.entity";
import { Address } from "../../address/entities/address.entity";

@ObjectType()
@Entity()
export class EventToUser extends Node {
  @Column()
  @RelationId((self: EventToUser) => self.user)
  userId!: User["id"];

  @Column()
  @RelationId((self: EventToUser) => self.event)
  eventId!: Event["id"];

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.members)
  readonly event!: Event;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.eventToUsers)
  readonly user!: User;

  @ManyToOne(() => Address)
  @JoinColumn([{ name: "addressId", referencedColumnName: "id" }])
  address: Address;

  @Field(() => String, { nullable: true })
  @RelationId((self: User) => self.address)
  readonly addressId: Address["id"];
}
