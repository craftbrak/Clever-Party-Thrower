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
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "../auth/public.decorator";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";
import { Address } from "../address/entities/address.entity";
import { AddressService } from "../address/address.service";
import { EventToUserService } from "../event-to-user/event-to-user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly eventToUserService: EventToUserService,
  ) {}
  @Public()
  @Mutation(() => User)
  async createUser(@Args("singUp") createUserInput: CreateUserDto) {
    return await this.userService.create(createUserInput);
  }

  @Query(() => User, { name: "user" })
  async findOne(@Args("email", { type: () => String }) email: User["email"]) {
    return await this.userService.findOne(email);
  }

  @Mutation(() => User)
  async updateUser(@Args("updateUserInput") updateUserInput: UpdateUserDto) {
    return await this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  async removeUser(@Args("id", { type: () => Int }) id: User["id"]) {
    return await this.userService.remove(id);
  }

  @ResolveField("eventToUsers", () => [EventToUser]) //TODO: FIX NAME OF FIELD
  async events(@Parent() user: User) {
    return await this.eventToUserService.findAllOfUser(user);
  }

  @ResolveField("address", () => Address)
  async address(@Parent() user: User) {
    return await this.addressService.findOne(user.addressId);
  }
}
