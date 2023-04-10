import { Injectable } from "@nestjs/common";
import { CreateDeptInput } from "./dto/create-dept.input";
import { UpdateDeptInput } from "./dto/update-dept.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Dept } from "./entities/dept.entity";
import { Spending } from "../spending/entities/spending.entity";
import {
  calculateDebtsFromBalances,
  mapExpenses,
  optimiseDebts,
} from "./utils/debts.utils";
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
    private readonly spendingService: SpendingService,
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

  //TODO: add mutation + test
  async calculateDepts(eventId: string): Promise<Dept[]> {
    const expenses: Spending[] = await this.spendingService.findAllOfEventById(
      eventId,
    );
    const depts: Dept[] = [];
    // const event = await this.eventRepository.findOne({
    //   where: {
    //     id: eventId,
    //   },
    //   relations: {
    //     members: true,
    //   },
    // });
    const eventToUsers = await this.eventToUserRepo.find({
      where: { eventId: eventId },
      relations: { user: true },
    });
    const participants = [];
    eventToUsers.forEach((userToEvent) => participants.push(userToEvent.user));
    const participantMap = await mapExpenses(expenses, participants); //contains every participant's balance
    const unOptdebts = await calculateDebtsFromBalances(
      participantMap,
      eventId,
    );
    const debts = await optimiseDebts(unOptdebts);

    for (const debt of debts) {
      depts.push(
        await this.create({
          amount: debt.amount,
          debtorId: debt.debtorId,
          creditorId: debt.creditorId,
          eventId: eventId,
          event: null,
          creditor: null,
          debtor: null,
        }),
      );
    }
    return depts;
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
    dept.event = await this.eventRepository.findOneByOrFail({
      id: updateDeptInput.eventId,
    });
    dept.debtor = await this.userRepo.findOneByOrFail({
      id: updateDeptInput.debtorId,
    });
    dept.creditor = await this.userRepo.findOneByOrFail({
      id: updateDeptInput.creditorId,
    });
    dept.amount = updateDeptInput.amount;
    dept.repayed = updateDeptInput.repayed;
    return dept.save();
  }

  remove(id: string) {
    return `This action removes a #${id} dept`;
  }
}
