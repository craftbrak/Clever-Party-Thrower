import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Logger } from "@nestjs/common";
import { AuthOutputDto } from "./dto/auth-output.dto";
import { Public } from "./public.decorator";
import { AuthInputDto } from "./dto/auth-input.dto";
import { UserEntity } from "../user/entities/user.entity";
import { CurrentUser } from "./current-user.decorator";
import { AuthRefreshDto } from "./dto/auth-refresh.dto";
import { VerifyEmailDto } from "./dto/verify_email.dto";
import { PasswordResetDto } from "./dto/passwordReset.dto";
import { JWTPayload } from "./jwtPayload.interface";

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
    this.logger.verbose("tout va bien", authInput.password, authInput.email);
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
  async enable2faStep1(@CurrentUser() user: JWTPayload) {
    return this.authService.setup2faStep1(user);
  }

  // @Mutation(() => Boolean)
  // async enable2faStep2(
  //   @CurrentUser() user: JWTPayload,
  //   @Args("2faCode") twofaCode: string,
  // ) {
  //   return this.authService.setup2faStep2(user, twofaCode);
  // }

  //todo: guard
  @Mutation(() => AuthOutputDto || Boolean)
  async enable2faStep2(
    @CurrentUser() user: UserEntity,
    @Args("twoFaCode") code: string,
  ): Promise<AuthOutputDto | boolean> {
    if (await this.authService.enable2FA(user, true, code)) {
      return await this.authService.login(user, code);
    }
    return false;
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
  async RequestResetPasswordEmail(
    @Args("email") email: string,
  ): Promise<boolean> {
    return await this.authService.SendResetPassword(email);
  }

  @Public()
  @Mutation(() => Boolean)
  async resetPassword(@Args("PassWordRestDTO") pswResetDTO: PasswordResetDto) {
    return this.authService.recoverPassword(
      pswResetDTO.token,
      pswResetDTO.password,
    );
  }
}
