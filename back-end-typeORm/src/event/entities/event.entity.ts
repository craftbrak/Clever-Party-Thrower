import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";

@ObjectType()
@Entity()
export class Event extends Node {
  @Column()
  @Field(() => String, { description: "Name of the event" })
  name: string;
  @Column()
  @Field(() => String, { description: "Description of the event" })
  description: string;
  @Column({ type: "float" })
  @Field(()=>Float,{description: 'Total spent for the event'})
  total: number;

}
