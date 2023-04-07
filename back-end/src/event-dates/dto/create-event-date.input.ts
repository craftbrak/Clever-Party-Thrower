import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventDateInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
