import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { AuthLoginOutput } from "./dto/auth-login.dto";
import { Public } from "./public.decorator";

@Resolver()
export class AuthResolver{
  constructor(private readonly authService:AuthService) {
  }
  @UseGuards(LocalAuthGuard)
  @Public()
  @Mutation(()=>AuthLoginOutput)
  async authLogin(
    @Context('req') req,
    @Args('username') _username:String,
    @Args('password') _password:String
  ){
    return this.authService.login(req.user)
  }
}