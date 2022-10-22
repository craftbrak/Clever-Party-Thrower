import { CreateAddressInput } from "./create-address.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";
import { Address } from "../entities/address.entity";

@InputType()
export class UpdateAddressDto extends CreateAddressInput {
  @Field(() => Int!)
  id: Address["id"];
}
