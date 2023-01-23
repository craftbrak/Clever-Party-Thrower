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
import { boolean } from "joi";

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
}
