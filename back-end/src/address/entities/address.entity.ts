import { Field, ObjectType } from "@nestjs/graphql";
import { Node } from "../../pagination/entities/node.entity";
import { Column, Entity, Index, ManyToOne, RelationId } from "typeorm";
import { Country } from "./country.entity";
import { IsPostalCode } from "class-validator";
import { Point } from "geojson";
import { UserEntity } from "../../user/entities/user.entity";

@Entity()
@ObjectType()
export class Address extends Node {
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  unitNumber: string;

  @Column()
  @Field(() => String)
  line1: string;

  @Column()
  @Field(() => String)
  city: string;
  @IsPostalCode()
  @Column()
  @Field(() => String)
  postalCode: string;

  @ManyToOne(() => Country, (country) => country.addresses)
  @Field(() => Country)
  country: Country;

  @Field(() => String)
  @RelationId((self: Address) => self.country)
  countryId: Country["id"];
  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  location: Point;
  @Field(() => UserEntity, { nullable: true })
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.addresses, {
    nullable: true,
  })
  owner: UserEntity;
  @Field(() => String, { nullable: true })
  @RelationId((self: Address) => self.owner)
  ownerId: UserEntity["id"];
}
