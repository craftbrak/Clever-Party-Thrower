import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ShoppingListItemsService } from './shopping-list-items.service';
import { ShoppingListItem } from './entities/shopping-list-item.entity';
import { CreateShopingListItemInput } from './dto/create-shoping-list-item.input';
import { UpdateShopingListItemInput } from './dto/update-shoping-list-item.input';

@Resolver(() => ShoppingListItem)
export class ShopingListItemsResolver {
  constructor(private readonly shopingListItemsService: ShoppingListItemsService) {}

  @Mutation(() => ShoppingListItem)
  createShopingListItem(@Args('createShopingListItemInput') createShopingListItemInput: CreateShopingListItemInput) {
    return this.shopingListItemsService.create(createShopingListItemInput);
  }

  @Query(() => [ShoppingListItem], { name: 'shopingListItems' })
  findAll() {
    return this.shopingListItemsService.findAll();
  }

  @Query(() => ShoppingListItem, { name: 'shopingListItem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.shopingListItemsService.findOne(id);
  }

  @Mutation(() => ShoppingListItem)
  updateShopingListItem(@Args('updateShopingListItemInput') updateShopingListItemInput: UpdateShopingListItemInput) {
    return this.shopingListItemsService.update(updateShopingListItemInput.id, updateShopingListItemInput);
  }

  @Mutation(() => ShoppingListItem)
  removeShopingListItem(@Args('id', { type: () => Int }) id: number) {
    return this.shopingListItemsService.remove(id);
  }
}
