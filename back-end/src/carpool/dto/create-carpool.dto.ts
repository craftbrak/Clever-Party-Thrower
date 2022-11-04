import { Field, Float, InputType } from "@nestjs/graphql";
import { Directions } from "../entities/carpool.entity";

@InputType()
export class CreateCarpoolDto {
  @Field(() => String)
  driverId: string;
  @Field(() => Directions)
  direction: Directions;
  @Field(() => String)
  finalDestinationId: string;
  @Field(() => String)
  startDestinationId: string;
  @Field(() => String)
  carId: string;
  @Field(() => String)
  eventId: string;
  @Field(() => Float)
  totalLength: number;
}

// TODO: DTOs
