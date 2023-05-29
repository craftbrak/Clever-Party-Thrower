import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class PasswordResetDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @Field(() => String)
  token: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  password: string;
}
