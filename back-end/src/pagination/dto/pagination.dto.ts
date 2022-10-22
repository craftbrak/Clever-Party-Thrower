import {
  ArgsType,
  Field,
  InputType,
  Int,
  InterfaceType,
  registerEnumType,
} from "@nestjs/graphql";
import { Node } from "../entities/node.entity";

export enum SortDirection {
  ASC,
  DESC,
}
registerEnumType(SortDirection, { name: "SortDirection" });

@InputType()
export class PaginationSortBy {
  @Field(() => SortDirection, { nullable: true })
  createdAt?: SortDirection;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  skip: number;
  @Field(() => Int)
  take: number;
  @Field(() => PaginationSortBy, { nullable: true })
  sortBy?: PaginationSortBy;
}
@InterfaceType()
export abstract class Pagination<N extends Node = Node> {
  @Field()
  totalCount: number;
  @Field(() => [Node], { description: "Contians the data of the request" })
  abstract nodes: N[];
}
