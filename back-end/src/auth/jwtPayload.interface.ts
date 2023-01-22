import { User } from "../user/entities/user.entity";

export interface JWTPayload {
  id: User["id"];
  email: User["email"];
  name: User["name"];
}
