import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Route } from "./entities/Route.entity";
import { CreateRouteDto } from "./dto/create-route.dto";
import { RouteService } from "./route.service";
import { UpdateRouteDto } from "./dto/update-route.dto";

@Resolver(() => Route)
export class RouteResolver {
  constructor(private readonly routeService: RouteService) {}

  @Mutation(() => Route)
  createCarpool(@Args("createRouteDto") createRouteDto: CreateRouteDto) {
    return this.routeService.create(createRouteDto);
  }

  @Query(() => [Route], { name: "routes" })
  findAll() {
    return this.routeService.findAll();
  }

  @Query(() => Route, { name: "route" })
  findOne(@Args("String", { type: () => String }) id: string) {
    return this.routeService.findOne(id);
  }

  @Mutation(() => Route)
  updateRoute(@Args("updateRouteDto") updateRouteDto: UpdateRouteDto) {
    return this.routeService.update(updateRouteDto.id, updateRouteDto);
  }

  @Mutation(() => Route)
  removeRoute(@Args("String", { type: () => String }) id: string) {
    return this.routeService.remove(id);
  }
}
