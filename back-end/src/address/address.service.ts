import { Injectable } from "@nestjs/common";
import { CreateAddressInput } from "./dto/create-address.input";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { DeleteResult, Repository } from "typeorm";
import { Country } from "./entities/country.entity";
import { CreateCountryInput } from "./dto/create-country.input";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) {}
  async create(createAddressInput: CreateAddressInput): Promise<Address> {
    return this.addressRepo.create(createAddressInput);
  }

  async findOne(id: Address["id"]): Promise<Address> {
    return this.addressRepo.findOneByOrFail({ id: id });
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
  async createCountry(input: CreateCountryInput):Promise<Country>{
    return await this.countryRepo.create(input)
  }
}
