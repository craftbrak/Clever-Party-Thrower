import { CreateSpendingInput } from './create-spending.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSpendingInput extends PartialType(CreateSpendingInput) {
  @Field(() => Int)
  id: number;
}
