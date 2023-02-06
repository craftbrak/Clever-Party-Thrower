import { Injectable } from "@nestjs/common";
import { CreateDeptInput } from "./dto/create-dept.input";
import { UpdateDeptInput } from "./dto/update-dept.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Car } from "../car/entities/car.entity";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Dept } from "./entities/dept.entity";
import { SpendingService } from "../spending/spending.service";
import { Spending } from "../spending/entities/spending.entity";

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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
  async calculateDepts(eventId: string): Promise<Dept[]> {
    const expenses: Spending[] = await this.spendingService.findAllOfEventById(
      eventId,
    );
    const depts: Dept[] = [];
    const participantMap = DeptService.mapExpenses(expenses, expenses[0].event); //contains every participant's balance
    const unOptdebts = await DeptService.calculateDebtsFromBalances(
      participantMap,
      eventId,
    );
    const debts = await DeptService.optimiseDepts(unOptdebts);

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
  static mapExpenses(
    expenses: Spending[],
    event: Event,
  ): Map<User["id"], number> {
    const pMap = new Map<User["id"], number>();
    const participants = event.members;
    expenses.forEach((expense) => {
      const share = expense.value / participants.length;
      participants.forEach((participant) => {
        if (!pMap.has(participant.id)) {
          pMap.set(participant.id, 0);
        }
        if (participant.id !== expense.buyer.id) {
          pMap.set(participant.id, pMap.get(participant.id) + share);
        }
        pMap.set(expense.buyer.id, pMap.get(expense.buyer.id) - share);
      });
    });
    return pMap;
  }
  static async calculateDebtsFromBalances(
    balances: Map<string, number>,
    eventId: string,
  ): Promise<Debt[]> {
    const debts: Debt[] = [];
    balances.forEach((balance, userId) => {
      if (balance > 0) {
        // trouver un autre utilisateur avec un solde négatif
        let found = false;
        balances.forEach((otherBalance, otherUserId) => {
          if (!found && otherBalance < 0 && userId !== otherUserId) {
            const debtAmount = Math.min(balance, -otherBalance);
            balances.set(userId, balance - debtAmount);
            balances.set(otherUserId, otherBalance + debtAmount);
            const debt: Debt = {
              amount: debtAmount,
              creditorId: userId,
              debtorId: otherUserId,
              eventId: eventId,
            };

            debts.push(debt);
            if (balance === debtAmount) {
              found = true;
            }
          }
        });
      }
    });
    return debts;
  }
  static async optimiseDepts(debts: Debt[]):Promise<Debt[]>{
    const optimisedDebts :Debt[]= []
    const exploredUser= new Map<User["id"],User['id']>()
    for (const debt of debts) {
      const currentCreditor = debt.creditorId
      const currentDebtor = debt.debtorId
      if((exploredUser.has(currentCreditor)&& exploredUser.get(currentCreditor)=== currentDebtor)||
          (exploredUser.has(currentDebtor)&& exploredUser.get(currentDebtor)=== currentCreditor)){
        break;
      }
      exploredUser.set(currentCreditor,currentDebtor)
      const optimisedDept :Debt= {creditorId: currentCreditor,debtorId: currentDebtor,eventId:debt.eventId, amount:0}
      const filteredDebts = debts.filter(det=> (det.debtorId === currentDebtor && det.creditorId===currentCreditor))
      for (const fdebt of filteredDebts) {
        optimisedDept.amount += fdebt.amount
      }
      const fDebts = debts.filter(det=> (det.debtorId===currentCreditor,det.creditorId===currentDebtor))
      for (const fDebt of fDebts) {
        optimisedDept.amount -=fDebt.amount
      }

      if (optimisedDept.amount > 0){
        optimisedDebts.push(optimisedDept)
      }
      if (optimisedDept.amount <0 ){
        optimisedDept.debtorId=currentCreditor;
        optimisedDept.creditorId = currentDebtor;
        optimisedDept.amount = Math.abs(optimisedDept.amount)
        optimisedDebts.push(optimisedDept)
      }
    }
    return optimisedDebts
  }
  findAll() {
    return `This action returns all dept`;
  }

  findOne(id: string) {
    return `This action returns a #${id} dept`;
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
