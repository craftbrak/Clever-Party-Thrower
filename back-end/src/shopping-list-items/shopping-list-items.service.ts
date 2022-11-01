import { Injectable } from "@nestjs/common";
import { CreateShoppingListItemDto } from "./dto/create-shopping-list-item.dto";
import { UpdateShoppingListItemDto } from "./dto/update-shopping-list-item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ShoppingListItem } from "./entities/shopping-list-item.entity";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";

@Injectable()
export class ShoppingListItemsService {
  constructor(
    @InjectRepository(ShoppingListItem)
    private readonly itemRepo: Repository<ShoppingListItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
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
    return this.itemRepo.find();
  }

  async findOne(id: string) {
    return this.itemRepo.findOneByOrFail({ id });
  }

  async update(
    id: string,
    updateShoppingListItemInput: UpdateShoppingListItemDto,
  ) {
    return this.itemRepo.update({ id }, updateShoppingListItemInput);
  }

  async remove(id: string) {
    return this.itemRepo.delete({ id });
  }
}
