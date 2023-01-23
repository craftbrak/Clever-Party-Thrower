import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class AuthRefreshDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @Field(() => String)
  refreshToken: string;
}
