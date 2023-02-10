import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { UserService } from "./user.service";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "../auth/public.decorator";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";
import { Address } from "../address/entities/address.entity";
import { AddressService } from "../address/address.service";
import { EventToUserService } from "../event-to-user/event-to-user.service";

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly eventToUserService: EventToUserService,
  ) {}
  @Public()
  @Mutation(() => UserEntity)
  async createUser(@Args("singUp") createUserInput: CreateUserDto) {
    return await this.userService.create(createUserInput);
  }

  @Query(() => UserEntity, { name: "user" })
  async findOne(
    @Args("email", { type: () => String }) email: UserEntity["email"],
  ) {
    return await this.userService.findOne(email);
  }

  @Mutation(() => UserEntity)
  async updateUser(@Args("updateUserInput") updateUserInput: UpdateUserDto) {
    return await this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => UserEntity)
  async removeUser(@Args("id", { type: () => Int }) id: UserEntity["id"]) {
    return await this.userService.remove(id);
  }

  @ResolveField("eventToUsers", () => [EventToUser]) //TODO: FIX NAME OF FIELD
  async events(@Parent() user: UserEntity) {
    return await this.eventToUserService.findAllOfUser(user);
  }

  @ResolveField("address", () => Address)
  async address(@Parent() user: UserEntity) {
    return await this.addressService.findOne(user.addressId);
  }
}
