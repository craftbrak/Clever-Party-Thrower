import { CreateAddressInput } from './create-address.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Address,  } from "../entities/address.entity";

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {
  @Field(() => Int)
  id: Address['id'];

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
