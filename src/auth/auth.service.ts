import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { hash, verify } from "argon2";
import type { FastifyReply, FastifyRequest } from "fastify";

import { LoginAuthDto } from "@/src/auth/dto/login-dto";
import type { JwtPayload } from "@/src/auth/types/jwt";
import { isDev } from "@/src/common/utils/isDev";
import { parseTimeToSeconds } from "@/src/common/utils/time-utils";
import { PrismaService } from "@/src/prisma/prisma.service";
import { UserService } from "@/src/user/user.service";

import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
      "JWT_ACCESS_TOKEN_TTL",
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
      "JWT_REFRESH_TOKEN_TTL",
    );

    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>("COOKIE_DOMAIN");
  }

  async login(res: FastifyReply, { email, password }: LoginAuthDto) {
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

    return await this.auth(res, user.id);
  }

  async logout(res: FastifyReply) {
    await this.setCookie(res, "refreshToken", new Date(0));
  }

  async refresh(req: FastifyRequest, res: FastifyReply) {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new NotFoundException();
      }

      return await this.auth(res, user.id);
    }
  }

  async registration(res: FastifyReply, { name, password, email }: AuthDto) {
    const hashedPassword = await hash(password);
    const user = await this.userService.create({
      name,
      password: hashedPassword,
      email,
    });

    return await this.auth(res, user.id);
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

  private async auth(res: FastifyReply, id: string) {
    const { accessToken, refreshToken } = this.generateAccessToken(id);
    console.log(parseTimeToSeconds(this.JWT_REFRESH_TOKEN_TTL));
    await this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + parseTimeToSeconds(this.JWT_REFRESH_TOKEN_TTL)),
    );

    return {
      accessToken,
    };
  }

  private async setCookie(res: FastifyReply, token: string, expires: Date) {
    await res.setCookie("refreshToken", token, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? "none" : "lax",
    });
  }
}
