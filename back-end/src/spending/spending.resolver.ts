import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { SpendingService } from "./spending.service";
import { Spending } from "./entities/spending.entity";
import { CreateSpendingDto } from "./dto/create-spending.dto";
import { UpdateSpendingDto } from "./dto/update-spending.dto";
import { ShoppingListItem } from "../shopping-list-items/entities/shopping-list-item.entity";
import { UsePipes, ValidationPipe } from "@nestjs/common";

@Resolver(() => Spending)
export class SpendingResolver {
  constructor(private readonly spendingService: SpendingService) {}

  @Mutation(() => Spending)
  @UsePipes(ValidationPipe)
  createSpending(
    @Args("createSpendingInput") createSpendingInput: CreateSpendingDto,
  ) {
    return this.spendingService.create(createSpendingInput);
  }

  @Query(() => [Spending], { name: "spendings" })
  findAll(
    @Args("eventId", { type: () => String, nullable: true }) eventId: string,
  ) {
    return this.spendingService.findAll(eventId);
  }

  @Query(() => Spending, { name: "spending" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.spendingService.findOne(id);
  }

  @Mutation(() => Spending)
  updateSpending(
    @Args("updateSpendingInput") updateSpendingInput: UpdateSpendingDto,
  ) {
    return this.spendingService.update(
      updateSpendingInput.id,
      updateSpendingInput,
    );
  }

  @Mutation(() => Spending)
  removeSpending(@Args("id", { type: () => String }) id: string) {
    return this.spendingService.remove(id);
  }

  @ResolveField("shoppingListItem", () => ShoppingListItem)
  async shoppingListItem(@Parent() spending: Spending) {
    return this.spendingService.getShoppingListItem(spending.id);
  }
}
