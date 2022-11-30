import { Field, ObjectType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

@ObjectType()
export class AuthOutputDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @Field(() => String)
  accessToken: string;
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @Field(() => String)
  refreshToken: string;
}
