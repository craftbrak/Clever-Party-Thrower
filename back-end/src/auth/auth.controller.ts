import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/localAuth.guard";
import { User } from "../user/entities/user.entity";
import { Request } from "express";
import { Public } from "./public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post("login")
  async login(
    @Req() req: Request,
    @Body("email") email: string,
    @Body("password") psw: string,
  ) {
    return await this.authService.login(
      (await this.authService.validateUser(email, psw)) as User,
    );
  }

  async refresh() {}
  async enable2FA() {}
  async login2fa() {}
  async disable2fa() {}
  async logout() {}
}
