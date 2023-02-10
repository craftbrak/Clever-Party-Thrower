import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/entities/user.entity";
import { JWTPayload } from "../jwtPayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: JWTPayload): Promise<UserEntity> {
    if (payload.isTwoFactorEnable) {
      if (payload.isTwoFaAuthenticated) {
        return await this.userService.findOne(payload.email);
      } else {
        throw new UnauthorizedException();
      }
    } else return await this.userService.findOne(payload.email);
  }
}
