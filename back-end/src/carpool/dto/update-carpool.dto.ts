import { CreateCarpoolDto } from "./create-carpool.dto";
import { InputType, Field, Int, PartialType, ID } from "@nestjs/graphql";

@InputType()
export class UpdateCarpoolDto extends PartialType(CreateCarpoolDto) {
  @Field(() => ID)
  id: string;
}
// TODO: DTOs
