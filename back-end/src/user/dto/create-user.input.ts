import { Field, InputType } from "@nestjs/graphql";
import { CreateAddressInput } from "../../address/dto/create-address.input";
import { Address } from "../../address/entities/address.entity";
import { IsEmail } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: "Name of the user" })
  name: string;
  @Field(() => String, { description: "Email of the user" })
  @IsEmail()
  email: string;
  @Field(() => String, { description: "Password of the user" })
  password: string;
  @Field(() => String, { nullable: true })
  avatar?: string;
  @Field(() => String)
  addressId: string;
}
