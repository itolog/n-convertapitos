import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

import * as cookieParser from "cookie-parser";
import helmet from "helmet";

import setupSwagger from "@/src/common/utils/swagger.util";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>("APP_PORT") ?? 3000;
  const ADDR = configService.get<string>("APP_ADDR") ?? "127.0.0.1";

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());

  app.use(cookieParser());

  setupSwagger(app);

  await app.listen(PORT, ADDR, () => {
    Logger.log(`App listen on http://${ADDR}:${PORT}`);
  });
}

bootstrap();
