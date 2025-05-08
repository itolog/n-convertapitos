import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import helmet from "@fastify/helmet";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>("APP_PORT") ?? 3000;
  const ADDR = configService.get<string>("APP_ADDR") ?? "127.0.0.1";

  const config = new DocumentBuilder()
    .setTitle("ConvertApiTos")
    .setDescription("The ConvertApiTos API")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory, {
    jsonDocumentUrl: "/swagger.json",
    yamlDocumentUrl: "/swagger.yaml",
    customSiteTitle: "ConvertApiTos API",
  });

  await app.listen(PORT, ADDR, () => {
    Logger.log(`App listen on http://${ADDR}:${PORT}`);
  });
}

bootstrap().catch((e) => {
  Logger.error(e);
});
