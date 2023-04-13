import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateAddressDto {
  @Field(() => String, { nullable: true })
  unitNumber: string;

  @Field(() => String)
  line1: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  countryId: string;

  @Field(() => String, { nullable: true })
  ownerId: string;
}
