import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import * as Joi from "joi";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, ".env"],
      isGlobal: true,

      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production")
          .default("development"),
        APP_PORT: Joi.number().port().default(3000),
        APP_ADDR: Joi.string().default("127.0.0.1"),
      }),
    }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
