import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSpendingInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
