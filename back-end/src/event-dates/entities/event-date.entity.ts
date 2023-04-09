import { Field, ObjectType } from "@nestjs/graphql";
import { Event } from "../../event/entities/event.entity";
import { Node } from "../../pagination/entities/node.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from "typeorm";
import { DatesToUser } from "../../dates-to-user/entities/dates-to-user.entity";

@ObjectType()
@Entity()
export class EventDate extends Node {
  @Column()
  @Field(() => String, { description: "The date" })
  date: Date;
  @RelationId((self: EventDate) => self.event)
  @Field(() => String)
  eventId: Event["id"];
  @Column({ default: 0 })
  @Field(() => Number)
  numberVotes: number;
  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.availableDates)
  @JoinColumn()
  event: Event;

  @Field(() => [DatesToUser])
  @OneToMany(() => DatesToUser, (DatestoUser) => DatestoUser.eventDate)
  @JoinColumn()
  datesToUsers: DatesToUser[];
}
