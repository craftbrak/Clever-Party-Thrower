import { Module } from '@nestjs/common';
import { SpendingService } from './spending.service';
import { SpendingResolver } from './spending.resolver';

@Module({
  providers: [SpendingResolver, SpendingService]
})
export class SpendingModule {}
