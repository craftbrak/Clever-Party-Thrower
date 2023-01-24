import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Logger, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { AuthOutputDto } from "./dto/auth-output.dto";
import { Public } from "./public.decorator";
import { AuthInputDto } from "./dto/auth-input.dto";
import { User } from "../user/entities/user.entity";
import { CurrentUser } from "./current-user.decorator";
import { AuthRefreshDto } from "./dto/auth-refresh.dto";
import { boolean, string } from "joi";
import { Auth2faDto } from "./dto/auth-2fa.dto";

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthOutputDto)
  async authLogin(
    @Context("req") req,
    @Args("authInputDto") authInput: AuthInputDto,
  ) {
    this.logger.debug(authInput.password, authInput.email);
    return await this.authService.login(
      (await this.authService.validateUser(
        authInput.email,
        authInput.password,
      )) as User,
      authInput.code,
    );
  }
  @Public()
  @Mutation(() => AuthOutputDto)
  async authRefresh(
    @CurrentUser() usr: User,
    @Args("AuthRefreshDto") authRefreshDto: AuthRefreshDto,
  ) {
    return await this.authService.refresh(authRefreshDto);
  }

  @Query(() => Boolean)
  async logout(@CurrentUser() usr: User) {
    await this.authService.logout(usr);
    return true;
  }
  //todo guard
  @Mutation(() => String || Boolean)
  async enable2fa(@CurrentUser() user: User) {
    return this.authService.setup2FA(user);
  }
  //todo: guard
  @Mutation(() => AuthOutputDto)
  async enable2faValidate(
    @CurrentUser() user: User,
    @Args() payload: Auth2faDto,
  ): Promise<AuthOutputDto> {
    await this.authService.enable2FA(user, true, payload.code);
    return await this.authService.login(user, payload.code);
  }
  @Query(() => Boolean)
  async disable2fa(@CurrentUser() user: User): Promise<boolean> {
    await this.authService.disable2fa(user);
    return true;
  }
}
