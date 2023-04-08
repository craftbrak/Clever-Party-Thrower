import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateRouteDto } from "./create-route.dto";

@InputType()
export class UpdateRouteDto extends PartialType(CreateRouteDto) {
  @Field(() => String)
  id: string;
}
