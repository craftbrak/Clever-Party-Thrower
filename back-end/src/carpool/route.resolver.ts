import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RouteEntity } from "./entities/Route.entity";
import { CreateRouteDto } from "./dto/create-route.dto";
import { RouteService } from "./route.service";
import { UpdateRouteDto } from "./dto/update-route.dto";

@Resolver(() => RouteEntity)
export class RouteResolver {
  constructor(private readonly routeService: RouteService) {}

  @Mutation(() => RouteEntity)
  createRoute(@Args("createRouteDto") createRouteDto: CreateRouteDto) {
    return this.routeService.create(createRouteDto);
  }

  @Query(() => [RouteEntity], { name: "routes" })
  findAll() {
    return this.routeService.findAll();
  }

  @Query(() => RouteEntity, { name: "route" })
  findOne(@Args("String", { type: () => String }) id: string) {
    return this.routeService.findOne(id);
  }

  @Mutation(() => RouteEntity)
  updateRoute(@Args("updateRouteDto") updateRouteDto: UpdateRouteDto) {
    return this.routeService.update(updateRouteDto.id, updateRouteDto);
  }

  @Mutation(() => RouteEntity)
  removeRoute(@Args("String", { type: () => String }) id: string) {
    return this.routeService.remove(id);
  }
}
