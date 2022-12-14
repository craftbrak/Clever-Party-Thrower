import {
  ObjectType,
  Field,
  Int,
  Float,
  registerEnumType,
} from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
export enum BootSizes {
  None = "None",
  Small = "Small",
  Medium = "Medium",
  Big = "Big",
  CampingCar = "CampingCar",
}
registerEnumType(BootSizes, { name: "BootSizes" });
export enum Fuels {
  Electric = "Electric",
  Petrol = "Petrol",
  Diesel = "Diesel",
  LPG = "LPG",
  HYDROGEN = "HYDROGEN",
}
registerEnumType(Fuels, { name: "Fuels" });
@ObjectType()
@Entity()
export class Car extends Node {
  @Field(() => String)
  @Column()
  brand: string;
  @Field(() => String)
  @Column()
  model: string;
  @Field(() => Int)
  @Column()
  maxPassengers: number;
  @Field(() => Float, { description: "consumption of the car in L/100km" })
  @Column({ type: "float" })
  consumption: number;

  @Field(() => BootSizes)
  @Column({
    type: "enum",
    enum: BootSizes,
    default: BootSizes.Medium,
  })
  bootSize: BootSizes;

  @Field(() => Fuels)
  @Column({
    type: "enum",
    enum: Fuels,
    default: Fuels.Petrol,
  })
  fuel: Fuels;

  @Field(() => Boolean)
  @Column()
  manualTransmission: boolean;

  @Field(() => Int, { description: "Range of the car in km" })
  @Column()
  range: number;

  @Field(() => Boolean)
  @Column({ default: false })
  shared: boolean;

  @ManyToOne(() => User, (user) => user.cars)
  @JoinColumn([{ name: "ownerId", referencedColumnName: "id" }])
  @Field(() => User)
  owner: User;

  @Field(() => String)
  @RelationId((self: Car) => self.owner)
  ownerId: User["id"];
}
