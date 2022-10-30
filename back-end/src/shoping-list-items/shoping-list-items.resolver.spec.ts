import { Test, TestingModule } from '@nestjs/testing';
import { ShopingListItemsResolver } from './shoping-list-items.resolver';
import { ShopingListItemsService } from './shoping-list-items.service';

describe('ShopingListItemsResolver', () => {
  let resolver: ShopingListItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopingListItemsResolver, ShopingListItemsService],
    }).compile();

    resolver = module.get<ShopingListItemsResolver>(ShopingListItemsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
