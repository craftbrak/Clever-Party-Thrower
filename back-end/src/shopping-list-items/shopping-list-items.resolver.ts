import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { ShoppingListItemsService } from "./shopping-list-items.service";
import { ShoppingListItem } from "./entities/shopping-list-item.entity";
import { CreateShoppingListItemDto } from "./dto/create-shopping-list-item.dto";
import { UpdateShoppingListItemDto } from "./dto/update-shopping-list-item.dto";
import { Event } from "../event/entities/event.entity";
import { UserEntity } from "../user/entities/user.entity";

@Resolver(() => ShoppingListItem)
export class ShoppingListItemsResolver {
  constructor(
    private readonly shopingListItemsService: ShoppingListItemsService,
  ) {}

  @Mutation(() => ShoppingListItem)
  createShoppingListItem(
    @Args("createShoppingListItemDto")
    createShoppingListItemDto: CreateShoppingListItemDto,
  ) {
    return this.shopingListItemsService.create(createShoppingListItemDto);
  }

  @Query(() => [ShoppingListItem], { name: "shoppingListItems" })
  findAll() {
    return this.shopingListItemsService.findAll();
  }

  @Query(() => ShoppingListItem, { name: "shoppingListItem" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.shopingListItemsService.findOne(id);
  }

  @Mutation(() => Boolean)
  async updateShoppingListItem(
    @Args("updateShoppingListItemInput")
    updateShoppingListItemDto: UpdateShoppingListItemDto,
  ) {
    const out = await this.shopingListItemsService.update(
      updateShoppingListItemDto.id,
      updateShoppingListItemDto,
    );
    return !!out;
  }

  @Mutation(() => Boolean)
  async removeShoppingListItem(@Args("id", { type: () => String }) id: string) {
    await this.shopingListItemsService.remove(id);
    return true;
  }

  @ResolveField("assigned", () => UserEntity, { nullable: true })
  async shoppingList(@Parent() event: Event): Promise<UserEntity> {
    return this.shopingListItemsService.getAssignee(event.id);
  }
}
