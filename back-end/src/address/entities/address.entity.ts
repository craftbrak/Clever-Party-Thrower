import { ObjectType, Field } from '@nestjs/graphql';
import { Node } from "../../pagination/entities/node.entity";
import { Column, Entity } from "typeorm";
@Entity()
@ObjectType()
export class Address extends Node{

  @Column()
  @Field(() => String)
  unitNumber: string

  @Column()
  @Field(() => String)
  streetNumber:string

  @Column()
  @Field(() => String)
  line1:string

  @Column()
  @Field(() => String)
  line2: string

  @Column()
  @Field(() => String)
  city: string

  @Column()
  @Field(() => String)
  postalCode:string

  // @ManyToOne(()=>Country,(country)=>country.addresses)
  // @Field(() => Country)
  // country:Country

}

// @Entity()
// @ObjectType()
// export class Country extends Node{
//
//   @Column()
//   @Field()
//   name:string
//
//   @Column()
//   @Field()
//   code:string
//
//   @OneToMany(()=>Address,(address)=>address.country)
//   addresses: Address[]
// }