import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SpendingService } from './spending.service';
import { Spending } from './entities/spending.entity';
import { CreateSpendingInput } from './dto/create-spending.input';
import { UpdateSpendingInput } from './dto/update-spending.input';

@Resolver(() => Spending)
export class SpendingResolver {
  constructor(private readonly spendingService: SpendingService) {}

  @Mutation(() => Spending)
  createSpending(@Args('createSpendingInput') createSpendingInput: CreateSpendingInput) {
    return this.spendingService.create(createSpendingInput);
  }

  @Query(() => [Spending], { name: 'spending' })
  findAll() {
    return this.spendingService.findAll();
  }

  @Query(() => Spending, { name: 'spending' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.spendingService.findOne(id);
  }

  @Mutation(() => Spending)
  updateSpending(@Args('updateSpendingInput') updateSpendingInput: UpdateSpendingInput) {
    return this.spendingService.update(updateSpendingInput.id, updateSpendingInput);
  }

  @Mutation(() => Spending)
  removeSpending(@Args('id', { type: () => Int }) id: number) {
    return this.spendingService.remove(id);
  }
}
