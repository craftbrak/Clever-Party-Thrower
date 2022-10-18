import { Injectable } from "@nestjs/common";
import { CreateAddressInput, UpdateAddressInput } from "../graphql";
import { DbService } from "../db/db.service";

@Injectable()
export class AddressService {
  constructor(private readonly prismaClient: DbService) {
  }

  async create(createAddressInput: CreateAddressInput) {
    return this.prismaClient.address.create({
      data: {
        street: createAddressInput.street,
        long: createAddressInput.long,
        number: createAddressInput.number,
        lat: createAddressInput.lat,
        city: createAddressInput.city,
        postalCode: createAddressInput.postalCode,
        country: createAddressInput.country,
      },
    });

  }

  findOne(id: number) {
    return this.prismaClient.address.findUnique({ where: { id: id } });
  }

  update(id: number, updateAddressInput: UpdateAddressInput) {
    return this.prismaClient.address.update({
        where: {
          id: id,
        }, data: updateAddressInput,
      },
    );
  }

  remove(id: number) {
    return this.prismaClient.address.delete({where:{id:id}});
  }
}
