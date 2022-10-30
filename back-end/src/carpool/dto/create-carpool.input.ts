import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCarpoolInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  totalLength: number
}
//TODO: DTOs