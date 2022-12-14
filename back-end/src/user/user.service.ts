import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as argon2 from "argon2";
import { AddressService } from "../address/address.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private addressService: AddressService,
  ) {}

  async create(createUserInput: CreateUserDto): Promise<User> {
    createUserInput.password = await argon2.hash(createUserInput.password);
    const usr = await this.userRepo.create(createUserInput);
    if (createUserInput.addressId)
      usr.address = await this.addressService.findOne(
        createUserInput.addressId,
      );
    return usr.save();
  }

  async findOne(email: User["email"]) {
    return await this.userRepo.findOneOrFail({
      where: {
        email: email,
      },
    });
  }

  async findOneById(id: User["id"]): Promise<User> {
    return await this.userRepo.findOneOrFail({
      where: { id },
      relations: {
        address: true,
        eventToUsers: true,
      },
    });
  }

  async update(id: string, updateUserInput: UpdateUserDto) {
    const usr = await this.findOneById(updateUserInput.id);
    if (updateUserInput.addressId) {
      usr.address = await this.addressService.findOne(
        updateUserInput.addressId,
      );
    }
    if (updateUserInput.email) usr.email = updateUserInput.email;
    if (updateUserInput.name) usr.name = updateUserInput.name;
    if (updateUserInput.password) usr.password = updateUserInput.password;
    if (updateUserInput.avatar) usr.avatar = updateUserInput.avatar;
    await usr.save();
    return usr;
  }

  async remove(id: string) {
    return await this.userRepo.delete({ id });
  }

  async updateRefreshToken(id: string, token: string): Promise<void> {
    const usr = await this.userRepo.findOneByOrFail({ id: id });
    usr.hashedRefreshToken = await argon2.hash(token);
    await usr.save();
  }
}
