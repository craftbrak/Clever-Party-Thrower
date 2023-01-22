import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ExecutionContext } from "@nestjs/common";

export class GlqAuthGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
