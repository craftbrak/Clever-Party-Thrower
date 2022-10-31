import { Test, TestingModule } from '@nestjs/testing';
import { ShopingListItemsResolver } from './shoping-list-items.resolver';
import { ShoppingListItemsService } from './shopping-list-items.service';

describe('ShopingListItemsResolver', () => {
  let resolver: ShopingListItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopingListItemsResolver, ShoppingListItemsService],
    }).compile();

    resolver = module.get<ShopingListItemsResolver>(ShopingListItemsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
