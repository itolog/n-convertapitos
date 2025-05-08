import { Injectable } from "@nestjs/common";

import { UserService } from "@/src/user/user.service";

import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async registration({ name, password, email }: AuthDto) {
    const user = await this.userService.create({ name, password, email });

    return user;
  }
}
