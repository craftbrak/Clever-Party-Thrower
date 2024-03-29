import { Field, Float, InputType } from "@nestjs/graphql";

@InputType()
export class CreateSpendingDto {
  @Field(() => String)
  buyerId: string;

  @Field(() => String)
  eventId: string;

  @Field(() => Float)
  value: number;
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => String, { nullable: true })
  shoppingListItemId?: string;

  @Field(() => String)
  beneficiaryId: string;
}
