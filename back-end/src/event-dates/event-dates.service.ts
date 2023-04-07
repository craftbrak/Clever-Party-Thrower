import { Injectable } from '@nestjs/common';
import { CreateEventDateInput } from './dto/create-event-date.input';
import { UpdateEventDateInput } from './dto/update-event-date.input';

@Injectable()
export class EventDatesService {
  create(createEventDateInput: CreateEventDateInput) {
    return 'This action adds a new eventDate';
  }

  findAll() {
    return `This action returns all eventDates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventDate`;
  }

  update(id: number, updateEventDateInput: UpdateEventDateInput) {
    return `This action updates a #${id} eventDate`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventDate`;
  }
}
