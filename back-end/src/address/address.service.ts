import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { DeleteResult, Repository } from "typeorm";
import { Country } from "./entities/country.entity";
import { CreateCountryDto } from "./dto/create-country.dto";
import { HttpService } from "@nestjs/axios";
import { UserEntity } from "../user/entities/user.entity";
import { JWTPayload } from "../auth/jwtPayload.interface";
import { catchError } from "rxjs";

@Injectable()
export class AddressService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AddressService.name);

  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly httpService: HttpService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log("Inserting Countries in DB");
    let tot = 0;
    await this.httpService
      .get("https://restcountries.eu/v3.1/all")
      .pipe(
        catchError((error) => {
          // Handle error here
          this.logger.error(
            "An error occurred while fetching countries:",
            error,
          );
          return [];
        }),
      )
      .subscribe((value) => {
        value.data.forEach((ct) => {
          const country = new Country();
          country.name = ct.name.common;
          country.code = ct.cca3;
          this.countryRepo.findOneBy({ name: country.name }).then((cont) => {
            if (!cont) {
              this.logger.log(`country ${country.name} added`);
              tot++;
              this.countryRepo.create(country).save();
            }
          });
        });
      });
    this.logger.log("Countries Inserted " + tot);
  }

  async create(
    createAddressInput: CreateAddressDto,
    user?: JWTPayload,
  ): Promise<Address> {
    const a = await this.addressRepo.create(createAddressInput).save();
    a.country = await this.findOneCountry(createAddressInput.countryId);
    if (createAddressInput.ownerId)
      a.owner = await this.userRepo.findOne({
        where: { id: createAddressInput.ownerId },
      });
    if (user) {
      a.owner = await this.userRepo.findOne({
        where: { id: user.id },
      });
    }
    return await a.save({ reload: true });
  }

  async findOne(id: Address["id"]): Promise<Address> {
    return await this.addressRepo.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        country: true,
        owner: true,
      },
    });
  }

  async update(id: Address["id"], updateAddressInput: UpdateAddressDto) {
    return await this.addressRepo.update({ id: id }, updateAddressInput);
  }

  async remove(id: Address["id"]): Promise<DeleteResult> {
    return await this.addressRepo.delete({ id: id });
  }

  async findAllCountry(): Promise<Country[]> {
    return await this.countryRepo.find();
  }

  async findOneCountry(id: Country["id"]): Promise<Country> {
    return await this.countryRepo.findOneByOrFail({ id });
  }

  async findOneCountryByCode(code: Country["code"]): Promise<Country> {
    return await this.countryRepo.findOneByOrFail({ code });
  }

  async createCountry(input: CreateCountryDto): Promise<Country> {
    return await this.countryRepo.create(input);
  }

  async findAllOfUser(user: JWTPayload) {
    return await this.addressRepo.find({ where: { owner: { id: user.id } } });
  }
}
