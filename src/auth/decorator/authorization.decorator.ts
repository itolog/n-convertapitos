import { applyDecorators, UseGuards } from "@nestjs/common";

import { GoogleAuthGuard, JwtAuthGuard } from "@/src/auth/guards/auth.guard";

export function Authorization() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}

export function GoogleAuthorization() {
  return applyDecorators(UseGuards(GoogleAuthGuard));
}
