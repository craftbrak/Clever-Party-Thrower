import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import * as argon2 from "argon2";
import { AddressService } from "../address/address.service";
import { HttpService } from "@nestjs/axios";
import { Address } from "../address/entities/address.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { randUuid } from "@ngneat/falso";
import { EmailService } from "../email.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    private addressService: AddressService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserInput: CreateUserDto): Promise<UserEntity> {
    createUserInput.password = await argon2.hash(createUserInput.password);
    const usr = await this.userRepo.create(createUserInput);
    if (createUserInput.addressId) {
      usr.address = await this.addressService.findOne(
        createUserInput.addressId,
      );
      usr.address.owner = usr;
      await usr.address.save();
    }
    usr.email = usr.email.toLowerCase();
    usr.avatar = createUserInput.avatar;
    this.sendVerificationEmail(usr);

    return await usr.save();
  }

  async findOne(email: UserEntity["email"]) {
    return await this.userRepo.findOneOrFail({
      where: {
        email: email,
      },
      relations: {
        cars: true,
        address: true,
        eventToUsers: true,
        addresses: true,
      },
    });
  }

  async findOneById(id: UserEntity["id"]): Promise<UserEntity> {
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
    if (updateUserInput.email && usr.email != updateUserInput.email) {
      usr.email = updateUserInput.email;
      usr.isVerified = false;
      this.sendVerificationEmail(usr);
    }
    if (updateUserInput.name) usr.name = updateUserInput.name;
    if (updateUserInput.password) usr.password = updateUserInput.password;
    usr.avatar = updateUserInput.avatar;
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

  async enable2fa(id: string, status: boolean) {
    const usr = await this.userRepo.findOneByOrFail({ id: id });
    usr.is2faEnabled = status;
    if (status == false) usr.twoFaKey = null;
    await usr.save();
  }
  sendVerificationEmail(user: UserEntity) {
    const payload = {
      sub: user.id,
      key: "email-validation",
    };
    const options = {
      expiresIn: "24h", // Set an expiration time for the token (optional)
    };
    const token = this.jwtService.sign(payload, options);
    this.emailService.sendEmailVerification(user.email, token);
  }
  async verifyUser(token: string) {
    try {
      const decodedToken: any = this.jwtService.verify(token);

      if (decodedToken.type === "email-validation") {
        // The token is valid, return the user ID
        const usr = await this.userRepo.findOneOrFail({
          where: { id: decodedToken.sub },
        });
        usr.isVerified = true;
        await usr.save();
      }
    } catch (err) {
      // Handle token expiration or any other error
    }
    return false;
  }

  async set2FAKey(id: string, token: string) {
    const usr = await this.userRepo.findOneByOrFail({ id: id });
    usr.twoFaKey = token;
    await usr.save();
  }
}
