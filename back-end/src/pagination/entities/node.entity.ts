import { Field, ID, Int, InterfaceType } from "@nestjs/graphql";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@InterfaceType()
export abstract class Node extends BaseEntity{
  @Field(()=>ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(()=>Date)
  @CreateDateColumn()
  createdAt:Date;

  @Field(()=>Date)
  @UpdateDateColumn()
  updatedAt:Date;
  @Field(()=>Int)
  @VersionColumn()
  version:number;
}