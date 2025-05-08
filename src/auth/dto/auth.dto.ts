import { PickType } from "@nestjs/swagger";

import { CreateUserDto } from "@/src/user/dto/create-user.dto";

export class AuthDto extends PickType(CreateUserDto, [
  "password",
  "email",
  "name",
]) {}
