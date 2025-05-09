import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import fastifyCookie from "@fastify/cookie";
import helmet from "@fastify/helmet";

import setupSwagger from "@/src/common/utils/swagger.util";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>("APP_PORT") ?? 3000;
  const ADDR = configService.get<string>("APP_ADDR") ?? "127.0.0.1";

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(fastifyCookie);

  setupSwagger(app);

  await app.listen(PORT, ADDR, () => {
    Logger.log(`App listen on http://${ADDR}:${PORT}`);
  });
}

bootstrap();
