import { CreateEventToUserDto } from "./create-event-to-user.dto";
import { InputType, Field, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateEventToUserDto extends PartialType(CreateEventToUserDto) {
  @Field(() => String)
  id: string;
}
