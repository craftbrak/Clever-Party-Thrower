import { CreateSpendingDto } from "./create-spending.dto";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateSpendingDto extends PartialType(CreateSpendingDto) {
  @Field(() => Int)
  id: number;
}
