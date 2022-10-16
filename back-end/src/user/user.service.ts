import { Injectable } from '@nestjs/common';
import { CreateUserInput,UpdateUserInput } from '../graphql';
import { DbService } from "../db/db.service";

@Injectable()
export class UserService {
  constructor(private prismaClient: DbService) {}
  create(createUserInput: CreateUserInput) {
    return this.prismaClient.user.create({
      data: createUserInput,
      include:{
        events: true
      }
    });
  }

  findAll() {
    return this.prismaClient.user.findMany({
      include:{
        events: true
      }
    });
  }

  findOne(id: number) {
    return this.prismaClient.user.findUnique({
      where: {
        id: id,
      },
      include:{
        events: true
      }
    });
  }

  update(id: number, updateUserInput: UpdateUserInput){
    return this.prismaClient.user.update({
      where:{
        id:updateUserInput.id
      },
      data:updateUserInput,
        include:{
          events: true
        }
    }
    );
  }

  remove(id: number){
    return this.prismaClient.user.delete({
      where:{
        id:id
      },
      include:{
        events: true
      }
    });
  }
}
