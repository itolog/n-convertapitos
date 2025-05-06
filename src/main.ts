import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";

const PORT = process.env.PORT ?? 3000;
const ADDR = process.env.ADDR ?? "127.0.0.1";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(PORT, ADDR, () => {
    Logger.log(`App listen on http://${ADDR}:${PORT}`);
  });
}

bootstrap().catch(() => {
  Logger.error("Something went wrong.");
});
