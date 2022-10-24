import { Query, Resolver } from "@nestjs/graphql";
import { Public } from "./auth/public.decorator";

@Resolver()
export class AppResolver {
  @Public()
  @Query(() => String)
  sayHello(): string {
    return "Hello";
  }
}
