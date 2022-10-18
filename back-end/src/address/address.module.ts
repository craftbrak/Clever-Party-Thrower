import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { DbModule } from "../db/db.module";

@Module({
  imports:[DbModule],
  providers: [AddressResolver, AddressService]
})
export class AddressModule {}
