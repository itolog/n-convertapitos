import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import helmet from "@fastify/helmet";

import { AppModule } from "./app.module";

const PORT = process.env.PORT ?? 3000;
const ADDR = process.env.ADDR ?? "127.0.0.1";

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
