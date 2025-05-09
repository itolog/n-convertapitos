import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import type { FastifyRequest } from "fastify";

import { User } from "@/prisma/generated/client";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    const user = request.user as User;
    return data ? user[data] : user;
  },
);
