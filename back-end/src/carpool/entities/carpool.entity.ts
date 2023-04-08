import { Field, Float, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Address } from "../../address/entities/address.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Node } from "../../pagination/entities/node.entity";
import { Car } from "../../car/entities/car.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { RouteEntity } from "./Route.entity";
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
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  driver: UserEntity;
  @Field(() => String)
  @RelationId((self: Carpool) => self.driver)
  driverId: string;
  @Field(() => [RouteEntity])
  @OneToMany(() => RouteEntity, (route) => route.carpool)
  routes: RouteEntity[];
  @Field(() => Directions)
  @Column({ type: "enum", enum: Directions })
  direction: Directions;
  @Field(() => Address)
  @ManyToOne(() => Address)
  endPoint: Address;
  @Field(() => String)
  @RelationId((self: Carpool) => self.endPoint)
  endPointId: string;
  @Field(() => Address)
  @ManyToOne(() => Address)
  startPoint: Address;
  @Field(() => String)
  @RelationId((self: Carpool) => self.startPoint)
  startPointId: string;
  @Field(() => Car)
  @ManyToOne(() => Car)
  car: Car;
  @Field(() => String)
  @RelationId((self: Carpool) => self.car)
  carId: string;
  @Field(() => Event)
  @ManyToOne(() => Event)
  event: Event;
  @Field(() => String)
  @RelationId((self: Carpool) => self.event)
  eventId: string;
  @Field(() => Float)
  @Column({ type: "float" })
  totalLength: number;
  @Field(() => Date)
  @Column({ default: new Date(Date.now()) })
  departure: Date;
  @Field(() => Date)
  @Column({ default: new Date(Date.now()) })
  arrival: Date;
}
