import { Injectable } from "@nestjs/common";
import { CreateDeptInput } from "./dto/create-dept.input";
import { UpdateDeptInput } from "./dto/update-dept.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Car } from "../car/entities/car.entity";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { Dept } from "./entities/dept.entity";

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Dept) private readonly deptRepo: Repository<Dept>,
  ) {}
  async create(createDeptInput: CreateDeptInput) {
    createDeptInput.event = await this.eventRepository.findOneByOrFail({
      id: createDeptInput.eventId,
    });
    createDeptInput.deptee = await this.userRepo.findOneByOrFail({
      id: createDeptInput.debteeId,
    });
    createDeptInput.lender = await this.userRepo.findOneByOrFail({
      id: createDeptInput.lenderId,
    });
    return this.deptRepo.create(createDeptInput).save();
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
    dept.debtee = await this.userRepo.findOneByOrFail({
      id: updateDeptInput.debteeId,
    });
    dept.lender = await this.userRepo.findOneByOrFail({
      id: updateDeptInput.lenderId,
    });
    dept.amount = updateDeptInput.amount;
    dept.repayed = updateDeptInput.repayed;
    return dept.save();
  }

  remove(id: string) {
    return `This action removes a #${id} dept`;
  }
}
