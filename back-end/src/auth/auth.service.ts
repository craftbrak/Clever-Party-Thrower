import { Injectable } from '@nestjs/common';
import { UserService } from "../user/user.service";
import { User } from "../user/entities/user.entity";
import { AuthLoginOutput } from "./dto/auth-login.dto";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";

export interface JWTPayload{
  id:User['id']
  email:User['email']
  name:User['name']
  }

@Injectable()
export class AuthService {
  constructor(private readonly userService:UserService,private readonly jwtService: JwtService) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && await argon2.verify(user.password, pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user:User):Promise<AuthLoginOutput>{
    const payload:JWTPayload= {
      id: user.id,
      email:user.email,
      name:user.name
    }
    return {
      accessToken:this.jwtService.sign(payload)
    }
  }
}
