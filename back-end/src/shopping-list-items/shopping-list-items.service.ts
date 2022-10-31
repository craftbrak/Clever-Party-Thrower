import { Injectable } from '@nestjs/common';
import { CreateShopingListItemInput } from './dto/create-shoping-list-item.input';
import { UpdateShopingListItemInput } from './dto/update-shoping-list-item.input';

@Injectable()
export class ShoppingListItemsService {
  //TODO: CRUD
  create(createShopingListItemInput: CreateShopingListItemInput) {
    return 'This action adds a new shopingListItem';
  }

  findAll() {
    return `This action returns all shopingListItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shopingListItem`;
  }

  update(id: number, updateShopingListItemInput: UpdateShopingListItemInput) {
    return `This action updates a #${id} shopingListItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopingListItem`;
  }
}
