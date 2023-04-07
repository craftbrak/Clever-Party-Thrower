import { CreateEventDateInput } from './create-event-date.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEventDateInput extends PartialType(CreateEventDateInput) {
  @Field(() => Int)
  id: number;
}
