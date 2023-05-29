import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/entities/user.entity";
import { AuthOutputDto } from "./dto/auth-output.dto";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { ConfigService } from "@nestjs/config";
import { JWTPayload } from "./jwtPayload.interface";
import { AuthRefreshDto } from "./dto/auth-refresh.dto";
import { authenticator } from "otplib";
import { VerifyEmailDto } from "./dto/verify_email.dto";
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<UserEntity>> {
    const user = await this.userService.findOne(email);
    if (user && (await argon2.verify(user.password, pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      if (user.is2faEnabled) {
        return null;
      }
      return result;
    }
    return null;
  }

  async loginOld(user: UserEntity): Promise<AuthOutputDto> {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isTwoFaAuthenticated: false,
      isTwoFactorEnable: user.is2faEnabled,
      isVerified: user.isVerified,
    };
    return await this.getTokens(payload);
  }

  async refresh(token: AuthRefreshDto): Promise<AuthOutputDto> {
    const pl = this.jwtService.verify(token.refreshToken, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
    });
    const payload: JWTPayload = {
      id: pl.id,
      email: pl.email,
      name: pl.name,
      isTwoFaAuthenticated: pl.isTwoFaAuthenticated,
      isTwoFactorEnable: pl.is2faEnabled,
      isVerified: pl.isVerified,
    };
    return await this.getTokens(payload);
  }

  async logout(user: UserEntity): Promise<void> {
    await this.userService.updateRefreshToken(user.id, "");
  }

  async enable2FA(user: UserEntity, status: boolean, code: string) {
    if (status === true) {
      if (authenticator.verify({ secret: code, token: user!.twoFaKey })) {
        await this.userService.enable2fa(user.id, status);
      }
    }
  }

  async setup2FA(usr: UserEntity) {
    if (usr.is2faEnabled) {
      return false;
    }
    const secret = authenticator.generateSecret();
    const appName = this.configService.get(
      "TWO_FACTOR_AUTHENTICATION_APP_NAME",
    );
    const otpUrl = authenticator.keyuri(usr.name, appName, secret);
    await this.userService.set2FAKey(usr.id, secret);
    return otpUrl;
  }

  async login(user: UserEntity | null, code: string): Promise<AuthOutputDto> {
    let verified = false;
    if (!user)
      return {
        invalidCredentials: true,
        refreshToken: "",
        accessToken: "",
      };
    if (user?.is2faEnabled) {
      if (authenticator.verify({ secret: code, token: user!.twoFaKey })) {
        verified = true;
      }
    }
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isTwoFaAuthenticated: verified,
      isTwoFactorEnable: user.is2faEnabled,
      isVerified: user.isVerified,
    };
    // console.table(payload);
    return this.getTokens(payload);
  }

  async disable2fa(user: UserEntity) {
    await this.userService.enable2fa(user.id, false);
    await this.userService.set2FAKey(user.id, "");
    return true;
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<boolean> {
    return this.userService.verifyUser(dto.verificationToken);
  }

  async SendResetPassword(email: string) {
    const user = await this.userService.findOne(email);
    this.logger.verbose(`User: ${user.name} requested a password reset`);
    this.logger.verbose(
      `User: ${user.name} is currently verified: ${user.isVerified}`,
    );
    if (user && user.isVerified) {
      const payload = {
        sub: user.id,
        key: "password-reset",
      };
      const options = {
        expiresIn: "6h",
        secret: this.configService.get("JWT_EMAIL_SECRET"),
      };
      const token = this.jwtService.sign(payload, options);
      user.hashedEmailValidationToken = await argon2.hash(token);
      await this.emailService.sendPasswordRecoveryEmail(email, token);
      return true;
    }
    return false;
  }

  async recoverPassword(token: string, password: string) {
    try {
      const decodedToken: any = this.jwtService.verify(token, {
        secret: this.configService.get("JWT_EMAIL_SECRET"),
      });

      if (decodedToken.key === "password-reset") {
        // The token is valid, return the user ID
        const usr = await this.userService.findOneById(decodedToken.sub);
        this.logger.verbose(
          `User: ${usr.name} has change his password to ${password}`,
        );
        console.table(decodedToken);
        usr.password = await argon2.hash(password);
        await usr.save();
        return true;
      }
    } catch (err) {
      this.logger.error(err);
      return false;
    }
    return false;
  }

  private async getTokens(payload: JWTPayload): Promise<AuthOutputDto> {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get("JWT_REFRESH_TTL"),
      secret: this.configService.get("JWT_REFRESH_SECRET"),
    });
    await this.userService.updateRefreshToken(payload.id, refreshToken);
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken,
      invalidCredentials: false,
    };
  }
}
