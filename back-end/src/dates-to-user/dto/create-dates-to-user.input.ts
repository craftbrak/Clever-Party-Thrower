import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDatesToUserInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
