import { Field, Float, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from "typeorm";
import { Node } from "../../pagination/entities/node.entity";
import { Address } from "../../address/entities/address.entity";
import { EventToUser } from "../../event-to-user/entities/event-to-user.entity";
import { Carpool } from "../../carpool/entities/carpool.entity";
import { ShoppingListItem } from "../../shopping-list-items/entities/shopping-list-item.entity";
import { Spending } from "../../spending/entities/spending.entity";
import { EventDate } from "../../event-dates/entities/event-date.entity";

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
  @Field(() => [EventToUser], { nullable: true })
  @OneToMany(() => EventToUser, (eventToUser) => eventToUser.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  members: EventToUser[];
  @Field(() => Address, { nullable: true })
  @ManyToOne(() => Address, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "addressId", referencedColumnName: "id" }])
  address: Address;
  @Field(() => String, { nullable: true })
  @RelationId((self: Event) => self.address)
  addressId: Address["id"];
  @Field(() => Carpool, { nullable: true })
  @OneToMany(() => Carpool, (carpool) => carpool.event, {
    cascade: true,
    onDelete: "CASCADE",
  })
  carpools: Carpool[]; //TODO: DTO

  @Field(() => [ShoppingListItem], { nullable: true })
  @OneToMany(() => ShoppingListItem, (items) => items.event, {
    cascade: true,
    onDelete: "CASCADE",
  })
  shoppingList: ShoppingListItem[]; //TODO: DTO

  @Field(() => Spending, { nullable: true })
  @OneToMany(() => Spending, (spending) => spending.event, {
    cascade: true,
    onDelete: "CASCADE",
  })
  spendings: Spending[];

  @Field(() => EventDate, { nullable: true })
  @OneToOne(() => EventDate, (eventDate) => eventDate.event, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "selectedDateId" })
  selectedDate: EventDate;

  @Field(() => String, { nullable: true })
  @RelationId((self: Event) => self.selectedDate)
  selectedDateId: string;

  @Field(() => [EventDate], { nullable: true })
  @OneToMany(() => EventDate, (eventDate) => eventDate.event, {
    cascade: true,
    onDelete: "CASCADE",
  })
  availableDates: EventDate[]; //todo: add Api Access for adding and removing dates + Votes

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  fixedDate: boolean; //Todo: add to dtos and creation
}
