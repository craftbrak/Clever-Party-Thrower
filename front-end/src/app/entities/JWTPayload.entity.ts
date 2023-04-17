import {UserEntity} from "./user.entity";

export interface JWTPayload {
  id: UserEntity["id"];
  email: UserEntity["email"];
  name: UserEntity["name"];
  isTwoFactorEnable?: boolean;
  isTwoFaAuthenticated?: boolean;
  iat: number
  exp: number
}
