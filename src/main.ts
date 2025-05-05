import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(PORT, () => {
    Logger.log(`App listen on http://localhost/${PORT}`);
  });
}

bootstrap().catch(() => {
  Logger.error("Something went wrong.");
});
