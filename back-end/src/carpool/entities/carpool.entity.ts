import {
  ObjectType,
  Field,
  Int,
  registerEnumType,
  Float,
} from "@nestjs/graphql";
import { Address } from "../../address/entities/address.entity";
import { User } from "../../user/entities/user.entity";
import { Node } from "../../pagination/entities/node.entity";
import { Car } from "../../car/entities/car.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Route } from "./Route.entity";
import { Event } from "../../event/entities/event.entity";

export enum Directions {
  go = "go",
  back = "back",
}
registerEnumType(Directions, {
  name: "Directions",
});
@ObjectType()
@Entity()
export class Carpool extends Node {
  @Field(() => User)
  @ManyToOne(() => User)
  driver: User;
  @Field(() => [Route])
  @OneToMany(() => Route, (route) => route.carpool)
  routes: Route[];
  @Field(() => Directions)
  @Column({ type: "enum", enum: Directions })
  direction: Directions;
  @Field(() => Address)
  @ManyToOne(() => Address)
  finalDestination: Address;
  @Field(() => Address)
  @ManyToOne(() => Address)
  startDestination: Address;
  @Field(() => Car)
  @ManyToOne(() => Car)
  car: Car;
  @Field(() => Event)
  @ManyToOne(() => Event)
  event: Event;
  @Field(() => Float)
  @Column({ type: "float" })
  totalLength: number;
}
