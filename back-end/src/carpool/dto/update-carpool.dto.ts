import { CreateCarpoolDto } from "./create-carpool.dto";
import { Field, InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateCarpoolDto extends PartialType(CreateCarpoolDto) {
  @Field(() => String)
  id: string;
}

// TODO: DTOs
