import { Module } from "@nestjs/common";

import { UserService } from "@/src/user/user.service";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
