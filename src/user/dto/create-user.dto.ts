import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsEmail } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "User Name",
    example: "John",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "User Email",
    example: "john@gmail.com",
    type: String,
    uniqueItems: true,
    format: "email",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: "Is email verified",
    example: "false",
    type: Boolean,
    default: false,
  })
  emailVerified?: boolean;
}
