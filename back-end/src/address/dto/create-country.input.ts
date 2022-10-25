import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCountryInput {
  @Field()
  name: string;

  @Field()
  code: string;
}
