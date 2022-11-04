import { CreateCarDto } from "./create-car.dto";
import { Field, InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateCarDto extends PartialType(CreateCarDto) {
  @Field(() => String)
  id: string;
}
