import { Injectable } from '@nestjs/common';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { InjectRepository } from "@nestjs/typeorm";
import { Address, } from "./entities/address.entity";
import { Repository } from "typeorm";

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private readonly  addressRepo: Repository<Address>,
              // @InjectRepository(Country) private readonly  countryRepo: Repository<Country>
              ) {
  }
  create(createAddressInput: CreateAddressInput) {
    return 'This action adds a new address';
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: Address['id'], updateAddressInput: UpdateAddressInput) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
