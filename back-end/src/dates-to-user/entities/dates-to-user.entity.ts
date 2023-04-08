import { Field, Int, ObjectType } from "@nestjs/graphql";
import { EventDate } from "../../event-dates/entities/event-date.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
import { EventToUser } from "../../event-to-user/entities/event-to-user.entity";

@ObjectType()
@Entity()
export class DatesToUser extends Node {
  @Field(() => String)
  @RelationId((self: DatesToUser) => self.eventDate)
  eventDateId: EventDate["id"];
  @ManyToOne(() => EventDate, (eventDate) => eventDate.datesToUsers)
  @Field(() => EventDate)
  eventDate: EventDate;
  @Field(() => EventToUser)
  @ManyToOne(() => EventToUser, (etou) => etou.availableDates)
  eventToUser: EventToUser;
  @Field(() => String)
  @RelationId((self: DatesToUser) => self.eventToUser)
  eventToUserId: string;
  @Field(() => Int)
  @Column()
  voteValue: number;
}
