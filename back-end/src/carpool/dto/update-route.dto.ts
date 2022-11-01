import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { CreateRouteDto } from "./create-route.dto";

@InputType()
export class UpdateRouteDto extends PartialType(CreateRouteDto) {
  @Field(() => ID)
  id: string;
}
// TODO: DTOs
