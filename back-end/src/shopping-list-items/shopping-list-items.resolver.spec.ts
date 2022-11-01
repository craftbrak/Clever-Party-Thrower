import { Test, TestingModule } from "@nestjs/testing";
import { ShoppingListItemsResolver } from "./shopping-list-items.resolver";
import { ShoppingListItemsService } from "./shopping-list-items.service";

describe("ShopingListItemsResolver", () => {
  let resolver: ShoppingListItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingListItemsResolver, ShoppingListItemsService],
    }).compile();

    resolver = module.get<ShoppingListItemsResolver>(ShoppingListItemsResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
