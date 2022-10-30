import { Module } from '@nestjs/common';
import { ShopingListItemsService } from './shoping-list-items.service';
import { ShopingListItemsResolver } from './shoping-list-items.resolver';

@Module({
  providers: [ShopingListItemsResolver, ShopingListItemsService]
})
export class ShopingListItemsModule {}
