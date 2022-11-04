import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SpendingService } from "./spending.service";
import { Spending } from "./entities/spending.entity";
import { CreateSpendingDto } from "./dto/create-spending.dto";
import { UpdateSpendingDto } from "./dto/update-spending.dto";

@Resolver(() => Spending)
export class SpendingResolver {
  constructor(private readonly spendingService: SpendingService) {}

  @Mutation(() => Spending)
  createSpending(
    @Args("createSpendingInput") createSpendingInput: CreateSpendingDto,
  ) {
    return this.spendingService.create(createSpendingInput);
  }

  @Query(() => [Spending], { name: "spending" })
  findAll() {
    return this.spendingService.findAll();
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
}
