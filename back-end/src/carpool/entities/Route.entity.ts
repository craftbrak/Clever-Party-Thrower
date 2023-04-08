import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
import { Address } from "../../address/entities/address.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Carpool } from "./carpool.entity";
import { Route } from "../dto/Route.interface";

@ObjectType()
@Entity()
export class RouteEntity extends Node implements Route {
  @Field(() => Address)
  @ManyToOne(() => Address)
  starting: Address;
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  pickup: UserEntity;
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
  @Field(() => String)
  @RelationId((self: RouteEntity) => self.carpool)
  carpoolId: string;
  @Field(() => Date)
  @Column()
  departure: Date;
}
