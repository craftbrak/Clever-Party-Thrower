import { Injectable } from "@nestjs/common";
import { CreateSpendingDto } from "./dto/create-spending.dto";
import { UpdateSpendingDto } from "./dto/update-spending.dto";
import { Spending } from "./entities/spending.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { ShoppingListItem } from "../shopping-list-items/entities/shopping-list-item.entity";

@Injectable()
export class SpendingService {
  //TODO: CRUD
  //TODO: matching
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Spending)
    private readonly spendingRepository: Repository<Spending>,
    @InjectRepository(ShoppingListItem)
    private readonly shoppingListItemRepository: Repository<ShoppingListItem>,
  ) {}

  async create(createSpendingInput: CreateSpendingDto) {
    const spending = new Spending();
    if (createSpendingInput.shoppingListItemId)
      spending.shoppingListItem =
        await this.shoppingListItemRepository.findOneByOrFail({
          id: createSpendingInput.shoppingListItemId,
        });
    if (createSpendingInput.eventId)
      spending.event = await this.eventRepository.findOneByOrFail({
        id: createSpendingInput.eventId,
      });
    if (createSpendingInput.buyerId)
      spending.buyer = await this.userRepository.findOneByOrFail({
        id: createSpendingInput.buyerId,
      });
    if (createSpendingInput.value) spending.value = createSpendingInput.value;
    return this.spendingRepository.create(spending).save();
  }

  async findAll() {
    return this.spendingRepository.find();
  }

  async findOne(id: string) {
    return this.spendingRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateSpendingInput: UpdateSpendingDto) {
    const spending = await this.spendingRepository.findOneByOrFail({ id: id });
    if (updateSpendingInput.shoppingListItemId)
      spending.shoppingListItem =
        await this.shoppingListItemRepository.findOneByOrFail({
          id: updateSpendingInput.shoppingListItemId,
        });
    if (updateSpendingInput.eventId)
      spending.event = await this.eventRepository.findOneByOrFail({
        id: updateSpendingInput.eventId,
      });
    if (updateSpendingInput.buyerId)
      spending.buyer = await this.userRepository.findOneByOrFail({
        id: updateSpendingInput.buyerId,
      });
    if (updateSpendingInput.value) spending.value = updateSpendingInput.value;
    return spending.save();
  }

  async remove(id: string) {
    return this.spendingRepository.delete({ id: id });
  }
  async findAllOfEvent(event: Event): Promise<Spending[]> {
    return this.findAllOfEventById(event.id);
  }
  async findAllOfEventById(eventId: string): Promise<Spending[]> {
    const all = await this.findAll();
    return all.filter((spending) => (spending.event.id = eventId));
  }
}
