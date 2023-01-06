import { Resolver, Query, Mutation, Args, Int, ID } from "@nestjs/graphql";
import { DeptService } from "./dept.service";
import { Dept } from "./entities/dept.entity";
import { CreateDeptInput } from "./dto/create-dept.input";
import { UpdateDeptInput } from "./dto/update-dept.input";

@Resolver(() => Dept)
export class DeptResolver {
  constructor(private readonly deptService: DeptService) {}

  @Mutation(() => Dept)
  createDept(@Args("createDeptInput") createDeptInput: CreateDeptInput) {
    return this.deptService.create(createDeptInput);
  }

  @Query(() => [Dept], { name: "dept" })
  findAll() {
    return this.deptService.findAll();
  }

  @Query(() => Dept, { name: "dept" })
  findOne(@Args("id", { type: () => ID }) id: string) {
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
}
