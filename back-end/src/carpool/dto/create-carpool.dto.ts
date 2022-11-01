import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateCarpoolDto {
  @Field(() => Int, { description: "Example field (placeholder)" })
  totalLength: number;
}
// TODO: DTOs
