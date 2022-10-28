import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Logger, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { AuthLoginOutput } from "./dto/auth-login.dto";
import { Public } from "./public.decorator";

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Mutation(() => AuthLoginOutput)
  async authLogin(
    @Context("req") req,
    @Args("username") _username: string,
    @Args("password") _password: string,
  ) {
    this.logger.debug(_password, _username);
    return this.authService.login(req.user);
  }
}
