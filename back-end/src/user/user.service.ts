import { Injectable, Logger } from "@nestjs/common";
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
import { EmailService } from "../email/email.service";
import { JWTPayload } from "../auth/jwtPayload.interface";

@Injectable()
export class UserService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    private addressService: AddressService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserInput: CreateUserDto): Promise<UserEntity> {
    createUserInput.password = await argon2.hash(createUserInput.password);
    const usr = await this.userRepo.create(createUserInput);
    await usr.save();
    if (createUserInput.addressId) {
      usr.address = await this.addressService.findOne(
        createUserInput.addressId,
      );
      usr.address.owner = usr;
      await usr.address.save();
    }
    usr.email = usr.email.toLowerCase();
    usr.avatar = createUserInput.avatar;
    await this.sendVerificationEmail(usr);

    return await usr.save();
  }

  async findOne(email: UserEntity["email"]): Promise<UserEntity | null> {
    return await this.userRepo.findOne({
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
      await this.sendVerificationEmail(usr);
    }
    if (updateUserInput.name) usr.name = updateUserInput.name;
    if (updateUserInput.password)
      usr.password = await argon2.hash(updateUserInput.password);
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

  async sendVerificationEmail(user: UserEntity | JWTPayload) {
    const payload = {
      sub: user.id,
      key: "email-validation",
    };
    const options = {
      expiresIn: "24h", // Set an expiration time for the token (optional)
      secret: this.configService.get("JWT_EMAIL_SECRET"),
    };
    const token = this.jwtService.sign(payload, options);
    await this.emailService.sendEmailVerification(user.email, token);
    return true;
  }

  async verifyUser(token: string) {
    this.logger.verbose(`Email is being verified`);
    try {
      const decodedToken: any = this.jwtService.verify(token, {
        secret: this.configService.get("JWT_EMAIL_SECRET"),
      });
      this.logger.verbose(`Token decoded ${decodedToken}`);
      // console.table(decodedToken);
      if (decodedToken.key === "email-validation") {
        // The token is valid, return the user ID
        const usr = await this.userRepo.findOneOrFail({
          where: { id: decodedToken.sub },
        });
        usr.isVerified = true;
        this.logger.verbose(`Email Of ${usr.name}, was verified`);
        await usr.save();
        return true;
      }
    } catch (err) {
      this.logger.error(err);
      return false;
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
