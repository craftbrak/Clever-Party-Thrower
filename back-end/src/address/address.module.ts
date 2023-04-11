import { Module } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressResolver } from "./address.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { Country } from "./entities/country.entity";
import { CountryResolver } from "./country.resolver";
import { HttpModule } from "@nestjs/axios";
import { UserEntity } from "../user/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, Country, UserEntity]),
    HttpModule,
  ],
  providers: [AddressResolver, AddressService, CountryResolver],
  exports: [AddressService],
})
export class AddressModule {}
