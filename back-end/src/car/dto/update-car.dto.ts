import { CreateCarDto } from "./create-car.dto";
import { InputType, Field, PartialType, ID } from "@nestjs/graphql";

@InputType()
export class UpdateCarDto extends PartialType(CreateCarDto) {
  @Field(() => ID)
  id: string;
}
