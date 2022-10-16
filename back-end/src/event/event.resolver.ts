import { Resolver, Query, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql";
import { EventService } from './event.service';
import { CreateEventInput,UpdateEventInput } from '../graphql';
@Resolver('Event')
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation('createEvent')
  create(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventService.create(createEventInput);
  }

  @Query('event')
  findAll() {
    return this.eventService.findAll();
  }

  @Query('event')
  findOne(@Args('id') id: number) {
    return this.eventService.findOne(id);
  }

  @Mutation('updateEvent')
  update(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation('removeEvent')
  remove(@Args('id') id: number) {
    return this.eventService.remove(id);
  }
  @Mutation('addParticipant')
  addParticipant(@Args('id') id: number, @Args('userId') userId:number) {
    return this.eventService.addParticipant(id,userId);
  }
  @Mutation('removeParticipant')
  removeParticipant(@Args('id') id: number, @Args('userId') userId:number) {
    return this.eventService.removeParticipant(id,userId);
  }
  @ResolveField('participants')
  getParticipants(@Parent() event){
    return this.eventService.findParticipants(event.id)
  }
}
