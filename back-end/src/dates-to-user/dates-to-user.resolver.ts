import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DatesToUserService } from "./dates-to-user.service";
import { DatesToUser } from "./entities/dates-to-user.entity";
import { CreateDatesToUserInput } from "./dto/create-dates-to-user.input";
import { UpdateDatesToUserInput } from "./dto/update-dates-to-user.input";
import { CurrentUser } from "../auth/current-user.decorator";
import { JWTPayload } from "../auth/jwtPayload.interface";

@Resolver(() => DatesToUser)
export class DatesToUserResolver {
  constructor(private readonly datesToUserService: DatesToUserService) {}

  @Mutation(() => DatesToUser)
  createDatesToUser(
    @Args("createDatesToUserInput")
    createDatesToUserInput: CreateDatesToUserInput,
  ) {
    return this.datesToUserService.create(createDatesToUserInput);
  }

  @Query(() => [DatesToUser], { name: "datesToUser" })
  findAll(@CurrentUser() user: JWTPayload) {
    return this.datesToUserService.findAll();
  }

  @Query(() => DatesToUser, { name: "datesToUser" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.datesToUserService.findOne(id);
  }

  @Mutation(() => DatesToUser)
  updateDatesToUser(
    @Args("updateDatesToUserInput")
    updateDatesToUserInput: UpdateDatesToUserInput,
  ) {
    return this.datesToUserService.update(
      updateDatesToUserInput.id,
      updateDatesToUserInput,
    );
  }

  @Mutation(() => DatesToUser)
  removeDatesToUser(@Args("id", { type: () => String }) id: string) {
    return this.datesToUserService.remove(id);
  }
}
