import { OmitType, PartialType } from "@nestjs/mapped-types";

import { CreateUserDto } from "@/src/user/dto/create-user.dto";

export class FindUserDto extends PartialType(
  OmitType(CreateUserDto, ["password"]),
) {}
