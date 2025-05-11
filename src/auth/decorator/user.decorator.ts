import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import type { Request } from "express";

import { User } from "@/prisma/generated/client";

declare module "express" {
  interface Request {
    user?: User;
  }
}

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user as User;
    return data ? user[data] : user;
  },
);
