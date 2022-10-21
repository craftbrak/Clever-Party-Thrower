import { Injectable } from '@nestjs/common';
import { CreateCarInput, UpdateCarInput } from "../graphql";
import { DbService } from "../db/db.service";

@Injectable()
export class CarService {
  constructor(private prismaClient:DbService) {
  }
  create(createCarInput: CreateCarInput) {
    // @ts-ignore
    return this.prismaClient.car.create({
      data:{
        brand:createCarInput.brand,
        maxPassengers:createCarInput.maxPassenger,
        consumption:createCarInput.consumption,
        bootSize:createCarInput.bootSize,
        manual:createCarInput.manual,
        userId:createCarInput.owner.id
      }
    });
  }

  findAll(userId:number) {
    return this.prismaClient.car.findMany({where:{userId:userId}});
  }

  findOne(id: number) {
    return this.prismaClient.car.findMany({where:{id:id}});
  }

  update(id: number, updateCarInput: UpdateCarInput) {
    return this.prismaClient.car.update({where:{id:id},data:{
        brand:updateCarInput.brand,
        maxPassengers:updateCarInput.maxPassenger,
        consumption:updateCarInput.consumption,
        bootSize:updateCarInput.bootSize,
        manual:updateCarInput.manual,
        userId:updateCarInput.owner.id
      }});
  }

  remove(id: number) {
    return this.prismaClient.car.delete({where:{id:id}});
  }
}
