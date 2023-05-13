import { Injectable } from "@nestjs/common";
import { CreateShoppingListItemDto } from "./dto/create-shopping-list-item.dto";
import { UpdateShoppingListItemDto } from "./dto/update-shopping-list-item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ShoppingListItem } from "./entities/shopping-list-item.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Spending } from "../spending/entities/spending.entity";

@Injectable()
export class ShoppingListItemsService {
  constructor(
    @InjectRepository(ShoppingListItem)
    private readonly itemRepo: Repository<ShoppingListItem>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(Spending)
    private readonly spendingRepo: Repository<Spending>,
  ) {}

  //TODO: TESTING

  async create(createShoppingListItemInput: CreateShoppingListItemDto) {
    const item = new ShoppingListItem();
    item.name = createShoppingListItemInput.name;
    item.price = createShoppingListItemInput.price;
    item.bought = createShoppingListItemInput.bought;
    item.assigned = await this.userRepo.findOneByOrFail({
      id: createShoppingListItemInput.assignedId,
    });
    item.event = await this.eventRepo.findOneByOrFail({
      id: createShoppingListItemInput.eventId,
    });
    return this.itemRepo.create(item).save();
  }

  // Todo: find by event
  async findAll() {
    return this.itemRepo.find({ relations: { assigned: true, event: true } });
  }

  async findOne(id: string) {
    return this.itemRepo.findOne({
      where: { id: id },
      relations: { assigned: true, event: true },
    });
  }

  async update(
    id: string,
    updateShoppingListItemInput: UpdateShoppingListItemDto,
  ) {
    const item = await this.itemRepo.findOne({
      where: { id: id },
      relations: { event: true, assigned: true },
    });
    if (updateShoppingListItemInput.price) {
      item.price = updateShoppingListItemInput.price;
    }
    if (updateShoppingListItemInput.assignedId) {
      item.assigned = await this.userRepo.findOne({
        where: { id: updateShoppingListItemInput.assignedId },
      });
    }
    if (updateShoppingListItemInput.bought) {
      const spendingDto = {
        shoppingListItemId: item.id,
        eventId: item.event.id,
        value: item.price,
        buyerId: item.assigned.id,
      };
      const spending = await this.spendingRepo.create(spendingDto);
      spending.buyer = item.assigned;
      spending.event = item.event;
      spending.shoppingListItem = item;
      await spending.save();
      item.bought = updateShoppingListItemInput.bought;
    }
    if (!updateShoppingListItemInput.bought) {
      const spending = await this.spendingRepo.findOne({
        where: { shoppingListItem: { id: id } },
        relations: { shoppingListItem: true },
      });
      if (spending) {
        await this.spendingRepo.remove(spending);
      }
      item.bought = updateShoppingListItemInput.bought;
    }
    if (updateShoppingListItemInput.name) {
      item.name = updateShoppingListItemInput.name;
    }
    return item.save();
  }

  async remove(id: string) {
    return this.itemRepo.delete({ id });
  }

  async getAssignee(id: string) {
    return (await this.findOne(id)).assigned;
  }
}
