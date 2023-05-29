import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Logger } from "@nestjs/common";
import { AuthOutputDto } from "./dto/auth-output.dto";
import { Public } from "./public.decorator";
import { AuthInputDto } from "./dto/auth-input.dto";
import { UserEntity } from "../user/entities/user.entity";
import { CurrentUser } from "./current-user.decorator";
import { AuthRefreshDto } from "./dto/auth-refresh.dto";
import { VerifyEmailDto } from "./dto/verify_email_dto";

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
    this.logger.debug("tout va bien", authInput.password, authInput.email);
    return await this.authService.login(
      (await this.authService.validateUser(
        authInput.email.toLowerCase(),
        authInput.password,
      )) as UserEntity,
      authInput.code,
    );
  }

  @Public()
  @Mutation(() => AuthOutputDto)
  async authRefresh(
    @CurrentUser() usr: UserEntity,
    @Args("AuthRefreshDto") authRefreshDto: AuthRefreshDto,
  ) {
    return await this.authService.refresh(authRefreshDto);
  }

  @Query(() => Boolean)
  async logout(@CurrentUser() usr: UserEntity) {
    await this.authService.logout(usr);
    return true;
  }

  //todo guard
  @Mutation(() => String || Boolean)
  async enable2fa(@CurrentUser() user: UserEntity) {
    return this.authService.setup2FA(user);
  }

  //todo: guard
  @Mutation(() => AuthOutputDto)
  async enable2faValidate(
    @CurrentUser() user: UserEntity,
    @Args("AuthInputDto") payload: AuthInputDto,
  ): Promise<AuthOutputDto> {
    await this.authService.enable2FA(user, true, payload.code);
    return await this.authService.login(user, payload.code);
  }

  @Query(() => Boolean)
  async disable2fa(@CurrentUser() user: UserEntity): Promise<boolean> {
    await this.authService.disable2fa(user);
    return true;
  }

  @Public()
  @Mutation(() => Boolean)
  async verifyEmail(@Args("VerifyEmailDTO") dto: VerifyEmailDto) {
    return await this.authService.verifyEmail(dto);
  }

  @Public()
  @Mutation(() => Boolean)
  async resetPassword(@Args("email") email: string): Promise<boolean> {
    return await this.authService.resetPassword(email);
  }
}
