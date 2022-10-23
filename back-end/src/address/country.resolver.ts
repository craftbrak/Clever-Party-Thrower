import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Country } from "./entities/country.entity";
import { AddressService } from "./address.service";
import { CreateCountryInput } from "./dto/create-country.input";

@Resolver(() => Country)
export class CountryResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => Country)
  async createCountry(@Args("CreateCountryInput") input: CreateCountryInput) {
    return await this.addressService.createCountry(input);
  }
  @Query(() => [Country], { name: "countries" })
  async countries() {
    return await this.addressService.findAllCountry();
  }
}
