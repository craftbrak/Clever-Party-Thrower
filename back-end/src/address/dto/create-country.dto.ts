import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCountryDto {
  @Field()
  name: string;

  @Field()
  code: string;
}
