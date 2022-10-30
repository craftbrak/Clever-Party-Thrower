import { ObjectType, Field, Int } from '@nestjs/graphql';
import {Node} from "../../pagination/entities/node.entity";
import {Column, Entity, ManyToOne} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Event} from "../../event/entities/event.entity";

@ObjectType()
@Entity()
export class Spending extends Node{
  @ManyToOne(()=>User)
  buyer: User
  @ManyToOne(()=>Event)
  event: Event
  @Column()
  value: number
  //TODO: GraphQl
  //TODO: DTO
}
