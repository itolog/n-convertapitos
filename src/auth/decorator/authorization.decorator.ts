import { applyDecorators, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "@/src/auth/guards/auth.guard";

export function Authorization() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
