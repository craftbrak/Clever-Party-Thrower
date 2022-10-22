import { Module } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressResolver } from "./address.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { Country } from "./entities/country.entity";
import { CountryResolver } from "./country.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Address, Country])],
  providers: [AddressResolver, AddressService, CountryResolver],
  exports: [AddressService],
})
export class AddressModule {}
