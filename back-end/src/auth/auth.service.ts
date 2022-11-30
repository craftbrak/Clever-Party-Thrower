import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { User } from "../user/entities/user.entity";
import { AuthOutputDto } from "./dto/auth-output.dto";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { ConfigService } from "@nestjs/config";

export interface JWTPayload {
  id: User["id"];
  email: User["email"];
  name: User["name"];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && (await argon2.verify(user.password, pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AuthOutputDto> {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return this.getTokens(payload);
  }

  async refresh(user: User): Promise<AuthOutputDto> {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return await this.getTokens(payload);
  }

  async logout(user: User): Promise<void> {
    await this.userService.updateRefreshToken(user.id, null);
  }

  private async getTokens(payload: JWTPayload): Promise<AuthOutputDto> {
    const refeshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get("JWT_REFRESH_TTL"),
      secret: this.configService.get("JWT_REFRESH_SECRET"),
    });
    await this.userService.updateRefreshToken(payload.id, refeshToken);
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refeshToken,
    };
  }
}
