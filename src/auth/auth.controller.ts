import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";

import type { FastifyReply, FastifyRequest } from "fastify";

import { LoginAuthDto } from "@/src/auth/dto/login-dto";

import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() authDto: LoginAuthDto,
  ) {
    return await this.authService.login(res, authDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("registration")
  async registration(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() authDto: AuthDto,
  ) {
    return await this.authService.registration(res, authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return await this.authService.refresh(req, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: FastifyReply) {
    return await this.authService.logout(res);
  }
}
