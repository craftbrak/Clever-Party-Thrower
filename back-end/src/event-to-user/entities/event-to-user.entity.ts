import { Field, Float, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { Address } from "../../address/entities/address.entity";
import { Event } from "../../event/entities/event.entity";
import { Node } from "../../pagination/entities/node.entity";
import { DatesToUser } from "../../dates-to-user/entities/dates-to-user.entity";

export enum UserRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
  DJ = "DJ",
  INVITED = "INVITED",
  NOT_ATTENDING = "NOT_ATTENDING",
}

registerEnumType(UserRole, {
  name: "UserRole",
});

@ObjectType()
@Entity()
export class EventToUser extends Node {
  @Field(() => String)
  @Column()
  @RelationId((self: EventToUser) => self.user)
  userId!: UserEntity["id"];
  @Field(() => String)
  @Column()
  @RelationId((self: EventToUser) => self.event)
  eventId!: Event["id"];

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.members)
  event!: Event;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.eventToUsers)
  user!: UserEntity;

  @Field(() => Address, { nullable: true })
  @ManyToOne(() => Address)
  @JoinColumn([{ name: "addressString", referencedColumnName: "id" }])
  address: Address;

  @Field(() => String, { nullable: true })
  @RelationId((self: EventToUser) => self.address)
  addressId: Address["id"];
  @Field(() => UserRole)
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.INVITED,
  })
  role: UserRole;
  @Field(() => [DatesToUser], { nullable: true })
  @OneToMany(() => DatesToUser, (dateToUser) => dateToUser.eventToUser)
  availableDates: DatesToUser[];

  @Field(() => Float)
  @Column({ default: 0, type: "float" })
  balance: number;
}
