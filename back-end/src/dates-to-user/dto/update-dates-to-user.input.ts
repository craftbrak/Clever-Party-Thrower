import { CreateDatesToUserInput } from "./create-dates-to-user.input";
import { Field, InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateDatesToUserInput extends PartialType(
  CreateDatesToUserInput,
) {
  @Field(() => String)
  id: string;
}
