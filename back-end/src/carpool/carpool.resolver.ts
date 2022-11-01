import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { CarpoolService } from "./carpool.service";
import { Carpool } from "./entities/carpool.entity";
import { CreateCarpoolDto } from "./dto/create-carpool.dto";
import { UpdateCarpoolDto } from "./dto/update-carpool.dto";

@Resolver(() => Carpool)
export class CarpoolResolver {
  constructor(private readonly carpoolService: CarpoolService) {}

  @Mutation(() => Carpool)
  createCarpool(
    @Args("createCarpoolInput") createCarpoolInput: CreateCarpoolDto,
  ) {
    return this.carpoolService.create(createCarpoolInput);
  }

  @Query(() => [Carpool], { name: "carpool" })
  findAll() {
    return this.carpoolService.findAll();
  }

  @Query(() => Carpool, { name: "carpool" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.carpoolService.findOne(id);
  }

  @Mutation(() => Carpool)
  updateCarpool(
    @Args("updateCarpoolInput") updateCarpoolInput: UpdateCarpoolDto,
  ) {
    return this.carpoolService.update(
      updateCarpoolInput.id,
      updateCarpoolInput,
    );
  }

  @Mutation(() => Carpool)
  removeCarpool(@Args("id", { type: () => String }) id: string) {
    return this.carpoolService.remove(id);
  }
}
