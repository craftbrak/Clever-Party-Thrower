import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Country } from "./entities/country.entity";
import { AddressService } from "./address.service";
import { CreateCountryDto } from "./dto/create-country.dto";
import { Public } from "../auth/public.decorator";

@Resolver(() => Country)
export class CountryResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => Country)
  async createCountry(@Args("CreateCountryInput") input: CreateCountryDto) {
    return await this.addressService.createCountry(input);
  }
  @Public()
  @Query(() => [Country], { name: "countries" })
  async countries() {
    return await this.addressService.findAllCountry();
  }
  @Public()
  @Query(() => Country, { name: "country" })
  async country(@Args("Code") code: string) {
    return await this.addressService.findOneCountryByCode(code);
  }
}
