import {ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne} from "typeorm";
import {Node} from "../../pagination/entities/node.entity";
import {Address} from "../../address/entities/address.entity";
import {User} from "../../user/entities/user.entity";
import {Carpool} from "./carpool.entity";
//TOdo: GRAPHQL FIEDLS
@ObjectType()
@Entity()
export class Route extends Node{
    @ManyToOne(()=>Address)
    starting:Address
    @ManyToOne(()=>User)
    pickup: User
    @ManyToOne(()=>Address)
    destination: Address
    @Column()
    index:number
    @Column()
    length: number
    @ManyToOne(()=>Carpool)
    carpool:Carpool
}