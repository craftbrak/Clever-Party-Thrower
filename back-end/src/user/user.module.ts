import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { DbModule } from "../db/db.module";
import { EventModule } from "../event/event.module";

@Module({
  providers: [UserResolver, UserService],
  imports:[DbModule,EventModule]
})
export class UserModule {}
