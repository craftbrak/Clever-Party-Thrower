import { Field, ObjectType } from "@nestjs/graphql";
import { EventDate } from "../../event-dates/entities/event-date.entity";
import { Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Event } from "../../event/entities/event.entity";
import { Node } from "../../pagination/entities/node.entity";
import { EventToUser } from "../../event-to-user/entities/event-to-user.entity";

@ObjectType()
@Entity()
export class DatesToUser extends Node {
  @RelationId((self: DatesToUser) => self.eventDate)
  eventDateId: EventDate["id"];
  @OneToMany(() => EventDate, (eventDate) => eventDate.datesToUsers)
  @Field(() => Event)
  eventDate: EventDate;
  @Field(() => EventToUser)
  @ManyToOne(() => EventToUser, (etou) => etou.availableDates)
  eventToUser: EventToUser;
  @Field(() => String)
  @RelationId((self: DatesToUser) => self.eventToUser)
  eventToUserId: string;
}
