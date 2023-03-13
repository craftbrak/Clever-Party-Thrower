import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType("AuthInputDto")
export class AuthInputDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field(() => String)
  email: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  code: string;
}
