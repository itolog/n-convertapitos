import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production")
    .default("development"),
  APP_PORT: Joi.number().port().default(3000),
  APP_ADDR: Joi.string().default("127.0.0.1"),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
  COOKIE_DOMAIN: Joi.string().required(),
});
