import { Test, TestingModule } from '@nestjs/testing';
import { ShopingListItemsService } from './shoping-list-items.service';

describe('ShopingListItemsService', () => {
  let service: ShopingListItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopingListItemsService],
    }).compile();

    service = module.get<ShopingListItemsService>(ShopingListItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
