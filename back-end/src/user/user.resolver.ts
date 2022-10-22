import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { Public } from "../auth/public.decorator";
import { EventToUser } from "../event/entities/eventToUser.entity";
import { Address } from "../address/entities/address.entity";
import { AddressService } from "../address/address.service";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}
  @Public()
  @Mutation(() => User)
  createUser(@Args("singUp") createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => User, { name: "user" })
  findOne(@Args("email", { type: () => String }) email: User["email"]) {
    return this.userService.findOne(email);
  }

  @Mutation(() => User)
  updateUser(@Args("updateUserInput") updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args("id", { type: () => Int }) id: User['id']) {
    return this.userService.remove(id);
  }

  @ResolveField("eventToUsers", () => [EventToUser]) //TODO: FIX NAME OF FIELD
  async events(@Parent() user: User) {
    const e = await this.userService.getEvents(user);
    console.log(e[0].event.id);
    return e;
  }

  @ResolveField("address", () => Address)
  async address(@Parent() user: User) {
    return this.addressService.findOne(user.addressId);
  }
}
