import { Field, Float, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
import { User } from "../../user/entities/user.entity";

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
  @Field(() => Float, { description: "Total spent for the event" })
  total: number;
  @Field(()=>[EventToUser],{ nullable: true })
  @OneToMany(() => EventToUser, eventToUser => eventToUser.user)
  members: EventToUser[];
}

@ObjectType()
@Entity()
export class EventToUser extends Node {

  @Column()
   userId!: User["id"];

  @Column()
   eventId!: Event["id"];
  @Field(()=>Event)
  @ManyToOne(() => Event, (event) => event.members)
  readonly event!: Event;
  @Field(()=>User)
    @ManyToOne(() => User, (user) => user.eventToUsers)
  readonly user!: User;

}
