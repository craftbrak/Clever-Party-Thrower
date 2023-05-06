import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class IsUserGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const currentUser = request.user;
    const args = ctx.getArgs();
    let entity;
    if (args.updateUserInput) {
      entity = args.updateUserInput;
    }
    if (args.id) {
      entity = args.deleteUserInput;
    }
    return this.validateOwnership(currentUser, entity);
  }

  validateOwnership(user, entity): boolean {
    // Implement the logic to determine if the user is the owner of the entity
    // This may vary depending on your application
    return user.id === entity.userId || user.id === entity.id;
  }
}
