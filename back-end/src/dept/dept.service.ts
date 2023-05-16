import { Injectable } from "@nestjs/common";
import { CreateDeptInput } from "./dto/create-dept.input";
import { UpdateDeptInput } from "./dto/update-dept.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Dept } from "./entities/dept.entity";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";
import { SpendingService } from "../spending/spending.service";

@Injectable()
export class DeptService {
  async;

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(EventToUser)
    private readonly eventToUserRepo: Repository<EventToUser>,
    @InjectRepository(Dept) private readonly deptRepo: Repository<Dept>,
    @InjectRepository(EventToUser)
    private readonly eventToUserRepository: Repository<EventToUser>,
    private spendingService: SpendingService,
  ) {}

  async create(createDeptInput: CreateDeptInput) {
    createDeptInput.event = await this.eventRepository.findOneByOrFail({
      id: createDeptInput.eventId,
    });
    createDeptInput.debtor = await this.userRepo.findOneByOrFail({
      id: createDeptInput.debtorId,
    });
    createDeptInput.creditor = await this.userRepo.findOneByOrFail({
      id: createDeptInput.creditorId,
    });
    return this.deptRepo.create(createDeptInput).save();
  }

  async calculateDepts(eventId: string): Promise<Dept[]> {
    await this.spendingService.updateUserBalance(eventId);
    // Récupérer tous les soldes pour l'événement
    const userBalances = await this.eventToUserRepository.find({
      where: { eventId: eventId },
      relations: {
        event: true,
        user: true,
      },
    });

    // Tri des soldes pour séparer les débiteurs et les créanciers
    const debtors = userBalances.filter(
      (userBalance) => userBalance.balance > 0,
    );
    const creditors = userBalances.filter(
      (userBalance) => userBalance.balance < 0,
    );

    // Tant qu'il y a des débiteurs et des créanciers
    while (debtors.length > 0 && creditors.length > 0) {
      // Trouver le débiteur et le créancier avec les soldes les plus élevés
      const maxDebtor = debtors.reduce((a, b) =>
        a.balance > b.balance ? a : b,
      );
      const maxCreditor = creditors.reduce((a, b) =>
        a.balance < b.balance ? a : b,
      );

      // Calculer le montant de la dette à rembourser
      const debtAmount = Math.min(maxDebtor.balance, -maxCreditor.balance);

      // Créer une nouvelle dette
      const newDebt = this.deptRepo.create({
        debtor: maxDebtor.user,
        creditor: maxCreditor.user,
        amount: debtAmount,
        event: maxDebtor.event,
        repayed: false,
      });

      // Sauvegarder la dette dans la base de données
      await this.deptRepo.save(newDebt);

      // Mettre à jour les soldes du débiteur et du créancier
      maxDebtor.balance -= debtAmount;
      maxCreditor.balance += debtAmount;

      // Si le solde du débiteur ou du créancier est maintenant 0, le retirer de la liste
      if (maxDebtor.balance === 0) {
        debtors.splice(debtors.indexOf(maxDebtor), 1);
      }
      if (maxCreditor.balance === 0) {
        creditors.splice(creditors.indexOf(maxCreditor), 1);
      }
    }

    // Mettre à jour les soldes dans la base de données
    await this.eventToUserRepository.save([...debtors, ...creditors]);
    return await this.deptRepo.find({ where: { event: { id: eventId } } });
  }

  findAll() {
    return this.deptRepo.findOne({
      relations: {
        debtor: true,
        creditor: true,
        event: true,
      },
    });
  }

  findOne(id: string) {
    return this.deptRepo.findOne({
      where: { id: id },
      relations: {
        debtor: true,
        creditor: true,
        event: true,
      },
    });
  }

  async update(updateDeptInput: UpdateDeptInput) {
    const dept = await this.deptRepo.findOneByOrFail({
      id: updateDeptInput.id,
    });
    if (updateDeptInput.eventId) {
      dept.event = await this.eventRepository.findOneByOrFail({
        id: updateDeptInput.eventId,
      });
    }
    if (updateDeptInput.debtorId) {
      dept.debtor = await this.userRepo.findOneByOrFail({
        id: updateDeptInput.debtorId,
      });
    }
    if (updateDeptInput.creditorId) {
      dept.creditor = await this.userRepo.findOneByOrFail({
        id: updateDeptInput.creditorId,
      });
    }
    if (updateDeptInput.amount) {
      dept.amount = updateDeptInput.amount;
    }
    if (updateDeptInput.repayed !== undefined) {
      dept.repayed = updateDeptInput.repayed;
    }
    return await dept.save();
  }

  remove(id: string) {
    return `This action removes a #${id} dept`;
  }

  async getEventDebts(id: string) {
    await this.deptRepo.delete({ event: { id: id } });
    await this.calculateDepts(id);

    return this.deptRepo.find({
      where: { event: { id: id } },
      relations: { debtor: true, event: true, creditor: true },
    });
  }
}
