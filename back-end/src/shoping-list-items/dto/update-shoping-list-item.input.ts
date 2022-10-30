import { CreateShopingListItemInput } from './create-shoping-list-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateShopingListItemInput extends PartialType(CreateShopingListItemInput) {
  @Field(() => Int)
  id: number;
}
