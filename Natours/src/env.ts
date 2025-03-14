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
});

export const envConfig = envSchema.parse({
  APP_PORT: process.env.APP_PORT,
  STAGE: process.env.STAGE,
});

export type EnvConfig = z.infer<typeof envSchema>;
