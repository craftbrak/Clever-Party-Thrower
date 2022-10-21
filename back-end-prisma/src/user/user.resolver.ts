import { Resolver, Query, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql";
import { UserService } from './user.service';
import { CreateUserInput,User,UpdateUserInput } from '../graphql';
import { EventService } from "../event/event.service";

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly eventService:EventService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query('users')
  findAll() {
    return this.userService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: number) {
    return this.userService.findOne(id);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.userService.remove(id);
  }
  @ResolveField('events')
  getEvents(@Parent() user ){
    return this.eventService.findAllOfUser(user.id )
  }
}
