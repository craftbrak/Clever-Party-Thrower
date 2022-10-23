import { CreateEventToUserInput } from "./create-event-to-user.input";
import { InputType, Field, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateEventToUserInput extends PartialType(
  CreateEventToUserInput,
) {
  @Field(() => String)
  id: string;
}
