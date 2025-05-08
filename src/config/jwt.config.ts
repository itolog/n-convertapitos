import { ConfigService } from "@nestjs/config";
import type { JwtModuleOptions } from "@nestjs/jwt";

export function jwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.getOrThrow<string>("JWT_SECRET"),
    signOptions: {
      algorithm: "HS256",
    },
  };
}
