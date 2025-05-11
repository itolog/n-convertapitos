import { ApiProperty } from "@nestjs/swagger";

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "User Name",
    example: "John",
    type: String,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: "User password",
    example: "super!pass1212",
    type: String,
    minLength: 6,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 128)
  password: string;

  @ApiProperty({
    description: "User Email",
    example: "john@gmail.com",
    type: String,
    uniqueItems: true,
    format: "email",
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User Photo",
    example: "https://example.com/photo.jpg",
    type: String,
    format: "url",
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  photo?: string | null;
}
