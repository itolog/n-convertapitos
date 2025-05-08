import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { hash, verify } from "argon2";

import { LoginAuthDto } from "@/src/auth/dto/login-dto";
import { JwtPayload } from "@/src/auth/types/jwt";
import { PrismaService } from "@/src/prisma/prisma.service";
import { UserService } from "@/src/user/user.service";

import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.JWT_SECRET = this.configService.getOrThrow<string>("JWT_SECRET");
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
      "JWT_ACCESS_TOKEN_TTL",
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
      "JWT_REFRESH_TOKEN_TTL",
    );
  }

  async login({ email, password }: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new NotFoundException();
    }

    return this.generateAccessToken(user.id);
  }

  async registration({ name, password, email }: AuthDto) {
    const hashedPassword = await hash(password);
    const user = await this.userService.create({
      name,
      password: hashedPassword,
      email,
    });

    return this.generateAccessToken(user.id);
  }

  private generateAccessToken(id: string) {
    const payload: JwtPayload = {
      id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
