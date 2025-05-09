import { ApiProperty, PickType } from "@nestjs/swagger";

import { CreateUserDto } from "@/src/user/dto/create-user.dto";

export class AuthDto extends PickType(CreateUserDto, [
  "password",
  "email",
  "name",
]) {}

export class AuthResponseDto {
  @ApiProperty({
    description: "JWT Access Token",
    example: "4f9083e2546af1b5a9eea4b4af7b0c8785f81421947e8ff48e636969c7c8ec80",
    type: String,
  })
  accessToken: string;
}
