import { Module } from "@nestjs/common";
import { DatesToUserService } from "./dates-to-user.service";
import { DatesToUserResolver } from "./dates-to-user.resolver";
import { DatesToUser } from "./entities/dates-to-user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  providers: [DatesToUserResolver, DatesToUserService],
  imports: [TypeOrmModule.forFeature([DatesToUser])],
})
export class DatesToUserModule {}
