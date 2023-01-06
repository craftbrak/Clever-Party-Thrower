import { CreateDeptInput } from "./create-dept.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateDeptInput extends PartialType(CreateDeptInput) {
  @Field(() => Int)
  id: string;
  @Field(() => Boolean)
  repayed = false;
}
