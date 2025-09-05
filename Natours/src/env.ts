import { config } from 'dotenv';
import { z } from 'zod';

import { STAGES } from './constants/env';

config();

export function isTest() {
  return process.env.NODE_ENV?.trim() === 'test';
}

const envSchema = z.object({
  APP_PORT: z.coerce.number().default(3000),
  STAGE: z.nativeEnum(STAGES).default(STAGES.Dev),
  DB_URL: z.string(),
	REDIS_URL: z.string(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_PASSWORD_TOKEN_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
});

export const envConfig = envSchema.parse({
  APP_PORT: process.env.APP_PORT,
  STAGE: process.env.STAGE,
  DB_URL: process.env.DB_URL,
	REDIS_URL: process.env.REDIS_URL,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_PASSWORD_TOKEN_SECRET: process.env.JWT_PASSWORD_TOKEN_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
});

export type EnvConfig = z.infer<typeof envSchema>;
