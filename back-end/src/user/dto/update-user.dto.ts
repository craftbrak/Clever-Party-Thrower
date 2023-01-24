import { CreateUserDto } from "./create-user.dto";
import { Field, InputType, PartialType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => String)
  id: User["id"];

  is2faEnabled?: boolean;

  isVerified?: boolean;

  TwoFAKey?: string;

  hashedEmailValidationToken?: string;
}
