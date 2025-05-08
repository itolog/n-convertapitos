import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { LoginAuthDto } from "@/src/auth/dto/login-dto";

import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() authDto: LoginAuthDto) {
    return await this.authService.login(authDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("registration")
  async registration(@Body() authDto: AuthDto) {
    return await this.authService.registration(authDto);
  }
}
