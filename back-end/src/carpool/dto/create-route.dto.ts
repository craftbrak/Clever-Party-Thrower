import { Field, Float, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateRouteDto {
  @Field(() => String)
  startingId: string;
  @Field(() => String)
  pickupId: string;
  @Field(() => String)
  destinationId: string;
  @Field(() => Int)
  index: number;
  @Field(() => Float, { description: "lenght of the route in KM" })
  length: number;
  @Field(() => String)
  carpoolId: string;
}

// TODO: DTOs
