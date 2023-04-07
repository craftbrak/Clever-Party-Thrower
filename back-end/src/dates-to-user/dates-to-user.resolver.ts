import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DatesToUserService } from './dates-to-user.service';
import { DatesToUser } from './entities/dates-to-user.entity';
import { CreateDatesToUserInput } from './dto/create-dates-to-user.input';
import { UpdateDatesToUserInput } from './dto/update-dates-to-user.input';

@Resolver(() => DatesToUser)
export class DatesToUserResolver {
  constructor(private readonly datesToUserService: DatesToUserService) {}

  @Mutation(() => DatesToUser)
  createDatesToUser(@Args('createDatesToUserInput') createDatesToUserInput: CreateDatesToUserInput) {
    return this.datesToUserService.create(createDatesToUserInput);
  }

  @Query(() => [DatesToUser], { name: 'datesToUser' })
  findAll() {
    return this.datesToUserService.findAll();
  }

  @Query(() => DatesToUser, { name: 'datesToUser' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.datesToUserService.findOne(id);
  }

  @Mutation(() => DatesToUser)
  updateDatesToUser(@Args('updateDatesToUserInput') updateDatesToUserInput: UpdateDatesToUserInput) {
    return this.datesToUserService.update(updateDatesToUserInput.id, updateDatesToUserInput);
  }

  @Mutation(() => DatesToUser)
  removeDatesToUser(@Args('id', { type: () => Int }) id: number) {
    return this.datesToUserService.remove(id);
  }
}
