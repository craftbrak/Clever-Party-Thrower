import { CreateDeptInput } from "./create-dept.input";
import { Field, InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateDeptInput extends PartialType(CreateDeptInput) {
  @Field(() => String)
  id: string;
  @Field(() => Boolean)
  repayed = false;
}
