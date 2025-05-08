import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("registration")
  async registration(@Body() authDto: AuthDto) {
    return await this.authService.registration(authDto);
  }
}
