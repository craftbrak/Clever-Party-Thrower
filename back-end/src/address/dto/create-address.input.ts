import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {

  @Field(() => String)
  unitNumber: string


  @Field(() => String)
  streetNumber:string


  @Field(() => String)
  line1:string


  @Field(() => String)
  line2: string


  @Field(() => String)
  city: string


  @Field(() => String)
  postalCode:string


  // @Field(() => String)
  // country:Country
}
