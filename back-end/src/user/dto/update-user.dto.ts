import { CreateUserDto } from "./create-user.dto";
import { Field, InputType, PartialType } from "@nestjs/graphql";
import { UserEntity } from "../entities/user.entity";

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => String)
  id: UserEntity["id"];

  is2faEnabled?: boolean;

  isVerified?: boolean;

  TwoFAKey?: string;

  hashedEmailValidationToken?: string;
}
