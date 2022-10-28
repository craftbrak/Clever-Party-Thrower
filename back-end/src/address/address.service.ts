import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { CreateAddressInput } from "./dto/create-address.input";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { DeleteResult, Repository } from "typeorm";
import { Country } from "./entities/country.entity";
import { CreateCountryInput } from "./dto/create-country.input";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AddressService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AddressService.name);
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    private readonly httpService: HttpService,
  ) {}
  async onApplicationBootstrap() {
    this.logger.log("Inserting Countries in DB");
    let tot = 0;
    const countries = await this.httpService
      .get("https://restcountries.com/v3.1/all")
      .toPromise();
    countries.data.forEach((ct) => {
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
    this.logger.log("Countries Inserted " + tot);
  }
  async create(createAddressInput: CreateAddressInput): Promise<Address> {
    const a = await this.addressRepo.create(createAddressInput).save();
    a.country = await this.findOneCountry(createAddressInput.countryId);
    return await a.save({ reload: true });
  }

  async findOne(id: Address["id"]): Promise<Address> {
    return this.addressRepo.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        country: true,
      },
    });
  }

  async update(id: Address["id"], updateAddressInput: UpdateAddressDto) {
    return this.addressRepo.update({ id: id }, updateAddressInput);
  }

  async remove(id: Address["id"]): Promise<DeleteResult> {
    return this.addressRepo.delete({ id: id });
  }
  async findAllCountry(): Promise<Country[]> {
    return this.countryRepo.find();
  }
  async findOneCountry(id: Country["id"]): Promise<Country> {
    return this.countryRepo.findOneByOrFail({ id });
  }
  async findOneCountryByCode(code: Country["code"]): Promise<Country> {
    return this.countryRepo.findOneByOrFail({ code });
  }
  async createCountry(input: CreateCountryInput): Promise<Country> {
    return this.countryRepo.create(input);
  }
}
