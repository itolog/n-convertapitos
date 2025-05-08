import { ConfigService } from "@nestjs/config";

export const isDevUtil = (configService: ConfigService) => {
  return configService.getOrThrow<string>("NODE_ENV") === "development";
};
