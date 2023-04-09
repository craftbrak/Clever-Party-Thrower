import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ShoppingListItemsService } from "./shopping-list-items.service";
import { ShoppingListItem } from "./entities/shopping-list-item.entity";
import { CreateShoppingListItemDto } from "./dto/create-shopping-list-item.dto";
import { UpdateShoppingListItemDto } from "./dto/update-shopping-list-item.dto";

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

  @Mutation(() => ShoppingListItem)
  updateShoppingListItem(
    @Args("updateShoppingListItemInput")
    updateShoppingListItemDto: UpdateShoppingListItemDto,
  ) {
    return this.shopingListItemsService.update(
      updateShoppingListItemDto.id,
      updateShoppingListItemDto,
    );
  }

  @Mutation(() => ShoppingListItem)
  removeShoppingListItem(@Args("id", { type: () => String }) id: string) {
    return this.shopingListItemsService.remove(id);
  }
}
