import { CreateAddressDto } from "./create-address.dto";
import { InputType, Field, Int } from "@nestjs/graphql";
import { Address } from "../entities/address.entity";

@InputType()
export class UpdateAddressDto extends CreateAddressDto {
  @Field(() => Int!)
  id: Address["id"];
}
