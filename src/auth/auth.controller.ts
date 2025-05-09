import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import type { FastifyReply, FastifyRequest } from "fastify";

import { User } from "@/prisma/generated/client";
import { LoginAuthDto } from "@/src/auth/dto/login-dto";
import { JwtAuthGuard } from "@/src/auth/jwt-auth.guard";

import { AuthService } from "./auth.service";
import { GetUser } from "./decorator/user.decorator";
import { AuthDto, AuthResponseDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "User Login",
    description: "Login to the system",
  })
  @ApiOkResponse({
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() authDto: LoginAuthDto,
  ) {
    return await this.authService.login(res, authDto);
  }

  @ApiOperation({
    summary: "User registration",
    description: "User registration in system",
  })
  @ApiOkResponse({
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse({
    description: "User with this email already exists",
  })
  @HttpCode(HttpStatus.CREATED)
  @Post("registration")
  async registration(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() authDto: AuthDto,
  ) {
    return await this.authService.registration(res, authDto);
  }

  @ApiOperation({
    summary: "Refreshing a token",
    description: "Generate a new access token",
  })
  @ApiUnauthorizedResponse()
  @ApiOkResponse({
    type: AuthResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return await this.authService.refresh(req, res);
  }

  @ApiOperation({
    description: "Logging off a user from the system",
    summary: "User Logout",
  })
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: FastifyReply) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@GetUser() user: User) {
    return user;
  }
}
