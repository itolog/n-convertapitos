import type { ConfigModuleOptions } from "@nestjs/config";

import { validationSchema } from "@/src/config/base/validationSchema";

export const baseConfig: ConfigModuleOptions = {
  envFilePath: [`.env.${process.env.NODE_ENV}`, ".env"],
  isGlobal: true,
  validationSchema,
};
