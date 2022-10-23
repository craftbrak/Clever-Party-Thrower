import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AddressService } from "./address.service";
import { Address } from "./entities/address.entity";
import { CreateAddressInput } from "./dto/create-address.input";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Country } from "./entities/country.entity";
import { Public } from "src/auth/public.decorator";

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => Address)
  @Public()
  async createAddress(
    @Args("createAddressInput") createAddressInput: CreateAddressInput,
  ) {
    return await this.addressService.create(createAddressInput);
  }

  @Query(() => Address, { name: "address" })
  async findOne(@Args("id", { type: () => String }) id: Address["id"]) {
    return await this.addressService.findOne(id);
  }

  @Mutation(() => Address)
  async updateAddress(
    @Args("updateAddressInput") updateAddressInput: UpdateAddressDto,
  ) {
    return await this.addressService.update(
      updateAddressInput.id,
      updateAddressInput,
    );
  }
  @Mutation(() => Address)
  async removeAddress(@Args("id", { type: () => Int }) id: Address["id"]) {
    return await this.addressService.remove(id);
  }
  @ResolveField("country", () => Country)
  async findCountry(@Parent() address: Address) {
    return await this.addressService.findOneCountry(address.countryId);
  }
}
