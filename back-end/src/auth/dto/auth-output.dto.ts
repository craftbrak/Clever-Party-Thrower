import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ObjectType()
export class AuthOutputDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  accessToken: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  refreshToken: string;
  @Field(() => Boolean, { defaultValue: false })
  invalidCredentials: boolean;
}
