import { CreateCarpoolInput } from './create-carpool.input';
import {InputType, Field, Int, PartialType, ID} from '@nestjs/graphql';

@InputType()
export class UpdateCarpoolInput extends PartialType(CreateCarpoolInput) {
  @Field(() => ID)
  id: string;
}
