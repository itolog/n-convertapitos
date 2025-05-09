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
import { isDevUtil } from "@/src/common/utils/isDev.util";
import { parseTimeToSeconds } from "@/src/common/utils/time.utils";
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

    return this.auth(res, user.id);
  }

  logout(res: FastifyReply) {
    this.setCookie(res, "refreshToken", new Date(0));
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

      return this.auth(res, user.id);
    }
  }

  async registration(res: FastifyReply, { name, password, email }: AuthDto) {
    const hashedPassword = await hash(password);
    const user = await this.userService.create({
      name,
      password: hashedPassword,
      email,
    });

    return this.auth(res, user.id);
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

  private auth(res: FastifyReply, id: string) {
    const { accessToken, refreshToken } = this.generateAccessToken(id);

    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + parseTimeToSeconds(this.JWT_REFRESH_TOKEN_TTL)),
    );

    return {
      accessToken,
    };
  }

  private setCookie(res: FastifyReply, token: string, expires: Date) {
    res.setCookie("refreshToken", token, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDevUtil(this.configService),
      sameSite: isDevUtil(this.configService) ? "none" : "lax",
    });
  }

  async validate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
