import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as argon2 from "argon2";
import { EventToUserService } from "../event/EventToUser.service";
import { JWTPayload } from "../auth/auth.service";
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo:Repository<User>, private eventToUserService:EventToUserService) {
  }
  async create(createUserInput: CreateUserInput):Promise<User> {
    createUserInput.password=await argon2.hash(createUserInput.password)
    return await this.userRepo.create(createUserInput).save();
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: User['email']) {
    return await this.userRepo.findOneOrFail({where:{
      email:email
      }});
  }
  async findOneById(id: User['id']):Promise<User>{
    return await this.userRepo.findOneOrFail({where:{id}})
  }
  async getEvents( user: JWTPayload){
    const e =await this.eventToUserService.findAllOfUser(user)
    return  e
  }
  async update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
