import { Field, InputType } from "@nestjs/graphql";
import { Column, OneToMany } from "typeorm";
import { Address } from "../entities/address.entity";

@InputType()
export class CreateCountryInput {
  @Field()
  name: string;

  @Field()
  code: string;
}
