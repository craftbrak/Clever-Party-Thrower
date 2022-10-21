import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
import { EventToUser } from "../../event/entities/event.entity";
@Entity()
@ObjectType()
export class User extends Node{
  @Field(() => String, { description: 'Name of the user' })
  @Column()
  name: string;
  @Field(() => String, { description: 'Email of the user' })
  @Column({unique:true})
  email: string;
  @Column()
  password: string;
  @Field(()=>String, {nullable:true})
  @Column({nullable:true})
  avatar?:string
  @Field(()=>EventToUser,{ nullable: true })
  @OneToMany(() => EventToUser, eventToUser => eventToUser.event)
  public eventToUsers!: EventToUser[];
}
