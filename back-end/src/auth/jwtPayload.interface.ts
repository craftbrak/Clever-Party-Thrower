import { UserEntity } from "../user/entities/user.entity";

export interface JWTPayload {
  id: UserEntity["id"];
  email: UserEntity["email"];
  name: UserEntity["name"];
  isTwoFactorEnable?: boolean;
  isTwoFaAuthenticated?: boolean;
}
