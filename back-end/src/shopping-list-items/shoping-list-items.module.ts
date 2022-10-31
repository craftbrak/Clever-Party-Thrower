import { Module } from '@nestjs/common';
import { ShoppingListItemsService } from './shopping-list-items.service';
import { ShopingListItemsResolver } from './shoping-list-items.resolver';

@Module({
  providers: [ShopingListItemsResolver, ShoppingListItemsService]
})
export class ShopingListItemsModule {}
