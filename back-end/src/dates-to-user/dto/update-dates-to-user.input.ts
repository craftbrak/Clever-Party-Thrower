import { CreateDatesToUserInput } from './create-dates-to-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDatesToUserInput extends PartialType(CreateDatesToUserInput) {
  @Field(() => Int)
  id: number;
}
