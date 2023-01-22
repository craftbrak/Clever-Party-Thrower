import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
import { Address } from "../../address/entities/address.entity";
import { User } from "../../user/entities/user.entity";
import { Carpool } from "./carpool.entity";

@ObjectType()
@Entity()
export class Route extends Node {
  @Field(() => Address)
  @ManyToOne(() => Address)
  starting: Address;
  @Field(() => User)
  @ManyToOne(() => User)
  pickup: User;
  @Field(() => Address)
  @ManyToOne(() => Address)
  destination: Address;
  @Field(() => Int)
  @Column()
  index: number;
  @Field(() => Float, { description: "lenght of the route in KM" })
  @Column()
  length: number;
  @Field(() => Carpool)
  @ManyToOne(() => Carpool)
  carpool: Carpool;
  @Field(() => Date)
  @Column()
  departure: Date;
}
