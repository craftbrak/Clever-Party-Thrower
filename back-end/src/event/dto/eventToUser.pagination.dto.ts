import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  Pagination,
  PaginationArgs,
  PaginationSortBy,
} from "../../pagination/dto/pagination.dto";
import { EventToUser } from "../../event-to-user/entities/event-to-user.entity";

@InputType()
export class MemberPaginationSortBy extends PaginationSortBy {
  // @Field(()=>SortDirection,{nullable:true})
  // name?:SortDirection;
}

@ArgsType()
export class MemberPaginationArgs extends PaginationArgs {
  @Field(() => MemberPaginationSortBy, { nullable: true })
  sortBy?: MemberPaginationSortBy;
}

@ObjectType()
export class MenmberPagination extends Pagination {
  @Field(() => [EventToUser])
  nodes: EventToUser[];
}
