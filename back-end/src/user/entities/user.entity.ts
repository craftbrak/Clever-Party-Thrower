import { ObjectType, Field } from "@nestjs/graphql";
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
import { EventToUser } from "../../event/entities/eventToUser.entity";
import { IsEmail } from "class-validator";
@Entity()
@ObjectType()
export class User extends Node {
  @Field(() => String, { description: "Name of the user" })
  @Column()
  name: string;
  @IsEmail()
  @Field(() => String, { description: "Email of the user" })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field(() => EventToUser, { nullable: true })
  @OneToMany(() => EventToUser, (eventToUser) => eventToUser.event)
  public eventToUsers!: EventToUser[];

  @ManyToOne(() => Address)
  @JoinColumn([{ name: "addressId", referencedColumnName: "id" }])
  address: Address;

  @Field(() => String, { nullable: true })
  @RelationId((self: User) => self.address)
  readonly addressId: Address["id"];
}
