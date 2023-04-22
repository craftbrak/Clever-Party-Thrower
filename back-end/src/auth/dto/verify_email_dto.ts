import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @Field(() => String)
  verificationToken: string;
}
