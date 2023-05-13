import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DeptService } from "./dept.service";
import { Dept } from "./entities/dept.entity";
import { UpdateDeptInput } from "./dto/update-dept.input";

@Resolver(() => Dept)
export class DeptResolver {
  constructor(private readonly deptService: DeptService) {}

  // @Mutation(() => Dept)
  // createDept(@Args("createDeptInput") createDeptInput: CreateDeptInput) {
  //   return this.deptService.create(createDeptInput);
  // }
  @Mutation(() => [Dept], { name: "calculateDebts" })
  calculateDebts(@Args("eventId") eventId: string) {
    return this.deptService.calculateDepts(eventId);
  }

  @Query(() => [Dept], { name: "depts" })
  findAll() {
    return this.deptService.findAll();
  }

  @Query(() => Dept, { name: "dept" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.deptService.findOne(id);
  }

  @Mutation(() => Dept)
  updateDept(@Args("updateDeptInput") updateDeptInput: UpdateDeptInput) {
    return this.deptService.update(updateDeptInput);
  }

  @Mutation(() => Dept)
  removeDept(@Args("id", { type: () => ID }) id: string) {
    return this.deptService.remove(id);
  }

  @Query(() => [Dept])
  getEventDebts(@Args("eventId", { type: () => ID }) id: string) {
    return this.deptService.getEventDebts(id);
  }
}
