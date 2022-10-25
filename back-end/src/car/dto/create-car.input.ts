import { Field, Float, InputType, Int, OmitType } from "@nestjs/graphql";
import { BootSizes, Car, Fuels } from "../entities/car.entity";
import { User } from "../../user/entities/user.entity";

@InputType()
export class CreateCarInput {
  @Field(() => String)
  brand: string;
  @Field(() => String)
  model: string;
  @Field(() => Int)
  maxPassengers: number;
  @Field(() => Float, { description: "consumption of the car in L/100km" })
  consumption: number;

  @Field(() => BootSizes)
  bootSize: BootSizes;

  @Field(() => Fuels)
  fuel: Fuels;

  @Field(() => Boolean)
  manualTransmission: boolean;

  @Field(() => Int, { description: "Range of the car in km" })
  range: number;

  @Field(() => String)
  ownerId: User["id"];
}
