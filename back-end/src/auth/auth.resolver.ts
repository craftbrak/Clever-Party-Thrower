import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Logger, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { AuthOutputDto } from "./dto/auth-output.dto";
import { Public } from "./public.decorator";
import { AuthInputDto } from "./dto/auth-input.dto";

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Mutation(() => AuthOutputDto)
  async authLogin(
    @Context("req") req,
    @Args("authInputDto") authInput: AuthInputDto,
  ) {
    this.logger.debug(authInput.password, authInput.email);
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Mutation(() => AuthOutputDto)
  async authRefresh(
    @Context("req") req,
    @Args("AuthInputDto") authInput: AuthInputDto,
  ) {
    this.logger.debug(authInput.password, authInput.email);
  }
}
