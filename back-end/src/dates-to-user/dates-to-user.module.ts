import { Module } from '@nestjs/common';
import { DatesToUserService } from './dates-to-user.service';
import { DatesToUserResolver } from './dates-to-user.resolver';

@Module({
  providers: [DatesToUserResolver, DatesToUserService]
})
export class DatesToUserModule {}
