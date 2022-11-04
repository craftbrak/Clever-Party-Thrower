import { CreateSpendingDto } from "./create-spending.dto";
import { Field, InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateSpendingDto extends PartialType(CreateSpendingDto) {
  @Field(() => String)
  id: string;
}
