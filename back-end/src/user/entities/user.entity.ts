import { Field, ObjectType } from "@nestjs/graphql";
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
import { EventToUser } from "../../event-to-user/entities/event-to-user.entity";
import { IsEmail } from "class-validator";
import { Car } from "../../car/entities/car.entity";

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

  @Field(() => Boolean)
  @Column({ default: false })
  drivingLicence: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  manual: boolean;

  @Field(() => EventToUser, { nullable: true })
  @OneToMany(() => EventToUser, (eventToUser) => eventToUser.event)
  public eventToUsers!: EventToUser[];

  @Field(() => Address, { nullable: true })
  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn([{ name: "addressId", referencedColumnName: "id" }])
  address: Address;

  @Field(() => String, { nullable: true })
  @RelationId((self: User) => self.address)
  addressId: Address["id"];

  @Field(() => [Car])
  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[];

  @Column({ nullable: true, default: null })
  hashedRefreshToken?: string;
}
