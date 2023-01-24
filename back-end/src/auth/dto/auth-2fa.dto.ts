import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

@InputType("Auth2FaDto")
export class Auth2faDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @Field(() => String)
  accessToken: string;
  @IsNotEmpty()
  @IsString()
  code: string;
}
