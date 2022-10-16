import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { DbModule } from "../db/db.module";

@Module({
  imports:[DbModule],
  providers: [EventResolver, EventService],
  exports:[EventService]
})
export class EventModule {}
