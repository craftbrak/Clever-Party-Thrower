import {ObjectType, Field, Int, registerEnumType} from '@nestjs/graphql';
import {Address} from "../../address/entities/address.entity";
import {User} from "../../user/entities/user.entity";
import {Node} from "../../pagination/entities/node.entity";
import {boolean} from "joi";
import {Car} from "../../car/entities/car.entity";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {Route} from "./Route.entity";

export enum Directions{
  go="go",
  back="back"
}
//TOdo: GRAPHQL FIEDLS

@ObjectType()
@Entity()
export class Carpool extends Node{
  @ManyToOne(()=>User)
  driver: User
  @OneToMany(()=>Route,route=>route.carpool)
  routes:Route[]
  @Column({type:"enum",enum:Directions})
  direction:Directions
  @ManyToOne(()=>Address)
  finalDestination:Address
  @ManyToOne(()=>Address)
  startDestination: Address
  @ManyToOne(()=>Car)
  car: Car
  @Column()
  totalLength: number
}
