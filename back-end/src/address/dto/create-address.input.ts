import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateAddressInput {
  @Field(() => String, {nullable:true})
  unitNumber: string;

  @Field(() => String)
  streetNumber: string;

  @Field(() => String)
  line1: string;

  @Field(() => String, {nullable:true})
  line2: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  countryId: string;
}
