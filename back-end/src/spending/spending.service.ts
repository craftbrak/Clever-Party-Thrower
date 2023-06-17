import { Injectable } from "@nestjs/common";
import { CreateSpendingDto } from "./dto/create-spending.dto";
import { UpdateSpendingDto } from "./dto/update-spending.dto";
import { Spending } from "./entities/spending.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { ShoppingListItem } from "../shopping-list-items/entities/shopping-list-item.entity";
import {
  EventToUser,
  UserRole,
} from "../event-to-user/entities/event-to-user.entity";

@Injectable()
export class SpendingService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Spending)
    private readonly spendingRepository: Repository<Spending>,
    @InjectRepository(ShoppingListItem)
    private readonly shoppingListItemRepository: Repository<ShoppingListItem>,
    @InjectRepository(EventToUser)
    private readonly eventToUserRepository: Repository<EventToUser>,
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
    if (createSpendingInput.beneficiaryId)
      spending.beneficiary = await this.userRepository.findOneByOrFail({
        id: createSpendingInput.beneficiaryId,
      });
    if (createSpendingInput.name) spending.name = createSpendingInput.name;
    if (createSpendingInput.value) spending.value = createSpendingInput.value;
    return this.spendingRepository.create(spending).save();
  }

  async findAll(eventId?: string) {
    if (eventId) {
      return this.spendingRepository.find({
        where: { event: { id: eventId } },
        relations: {
          event: true,
          buyer: true,
          shoppingListItem: true,
          beneficiary: true,
        },
      });
    }
    return this.spendingRepository.find({
      relations: {
        event: true,
        shoppingListItem: true,
        buyer: true,
        beneficiary: true,
      },
    });
  }

  async findOne(id: string) {
    return this.spendingRepository.findOne({
      where: { id },
      relations: {
        event: true,
        shoppingListItem: true,
        buyer: true,
        beneficiary: true,
      },
    });
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
    if (updateSpendingInput.name) spending.name = updateSpendingInput.name;
    if (updateSpendingInput.beneficiaryId) {
      spending.beneficiary = await this.userRepository.findOneByOrFail({
        id: updateSpendingInput.beneficiaryId,
      });
    }
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

  async getShoppingListItem(id: string) {
    const out = await this.spendingRepository.findOne({
      where: { id: id },
      relations: { shoppingListItem: true },
    });
    return out.shoppingListItem;
  }

  async setShoppingListItemSpendings(item: ShoppingListItem) {
    const spendings = await this.spendingRepository.find({
      where: { shoppingListItem: { id: item.id } },
    });
    await this.deleteShoppingListItemSpendings(item);
    if (item.bought) {
      await this.createShoppingListItemSpendings(item);
    }
    await this.updateUserBalance(item.event.id);
  }

  async createShoppingListItemSpendings(item: ShoppingListItem) {
    const users = await this.eventToUserRepository.find({
      where: { eventId: item.event.id },
      relations: {
        event: true,
        user: true,
      },
    });
    const excludedRoles = [UserRole.INVITED, UserRole.NOT_ATTENDING];
    const filteredUsers = users.filter(
      (user) => !excludedRoles.includes(user.role),
    );
    const amountPerUser = item.price / filteredUsers.length;
    filteredUsers.forEach((etu) => {
      this.create({
        eventId: item.event.id,
        name: item.name,
        value: amountPerUser,
        shoppingListItemId: item.id,
        beneficiaryId: etu.user.id,
        buyerId: item.assigned.id,
      });
    });
    console.log("created Spendings");
  }

  async deleteShoppingListItemSpendings(item: ShoppingListItem) {
    await this.spendingRepository.delete({ shoppingListItem: { id: item.id } });
    //todo: test this function
  }

  async updateUserBalance(eventId: string) {
    const spendings = await this.spendingRepository.find({
      where: { event: { id: eventId } },
      relations: { beneficiary: true, buyer: true },
    });

    // Réinitialiser les soldes de tous les utilisateurs pour l'événement
    const userBalances = await this.eventToUserRepository.find({
      where: { event: { id: eventId } },
      relations: { user: true, event: true },
    });
    for (const userBalance of userBalances) {
      userBalance.balance = 0;
    }

    // Parcourir toutes les dépenses et ajuster les soldes en conséquence
    for (const spending of spendings) {
      const buyerBalance = userBalances.find(
        (userBalance) => userBalance.userId === spending.buyer.id,
      );
      // console.log(spending.beneficiary);
      const beneficiaryBalance = userBalances.find(
        (userBalance) => userBalance.userId === spending.beneficiary.id,
      );
      if (buyerBalance) {
        buyerBalance.balance += spending.value;
        beneficiaryBalance.balance -= spending.value;
      }
    }

    // Mettre à jour les soldes dans la base de données
    for (const userBalance of userBalances) {
      await this.eventToUserRepository.save(userBalance);
    }
  }
}
