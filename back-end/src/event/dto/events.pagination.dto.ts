import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { Pagination, PaginationArgs, PaginationSortBy, SortDirection } from "../../pagination/dto/pagination.dto";
import { Event } from "../entities/event.entity";

@InputType()
export class EventsPaginationSortBy extends PaginationSortBy{
  @Field(()=>SortDirection,{nullable:true})
  name?:SortDirection;
}

@ArgsType()
export class EventsPaginationArgs extends PaginationArgs{
  @Field(()=> EventsPaginationSortBy,{nullable:true})
  sortBy?:EventsPaginationSortBy;
}

@ObjectType()
export class EventsPagination extends Pagination{
  @Field(()=>[Event])
  nodes:Event[];
}