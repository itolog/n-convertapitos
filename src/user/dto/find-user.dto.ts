import { OmitType, PartialType } from "@nestjs/swagger";

import { CreateUserDto } from "@/src/user/dto/create-user.dto";

export class FindUserDto extends PartialType(
  OmitType(CreateUserDto, ["password"]),
) {}
