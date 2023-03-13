import { Column, Entity, OneToMany } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Node } from "../../pagination/entities/node.entity";
import { Address } from "./address.entity";

@ObjectType()
@Entity()
export class Country extends Node {
  @Column({ unique: true })
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  code: string;

  @OneToMany(() => Address, (address) => address.country)
  addresses: Address[];
}
