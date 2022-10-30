import {ObjectType, Field, Int, Float} from '@nestjs/graphql';
import {Node} from "../../pagination/entities/node.entity";
import {User} from "../../user/entities/user.entity";
import {Column, Entity, ManyToOne} from "typeorm";
import {Event} from "../../event/entities/event.entity";

@ObjectType()
@Entity()
export class ShoppingListItem extends Node{
  @Column()
  name:string
  @Column({type:"float"})
  price: number
  @ManyToOne(()=>User,{nullable:true})
  assigned: User
  @Column()
  bought: boolean
  @ManyToOne(()=>Event, event=> event.shoppingList)
  event:Event
  //Todo:DTO
  //Todo:GRAPHQL
}
