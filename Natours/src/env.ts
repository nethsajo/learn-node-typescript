import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  APP_PORT: z.coerce.number().default(3000),
});

export const envConfig = envSchema.parse({
  APP_PORT: process.env.APP_PORT,
});

export type EnvConfig = z.infer<typeof envSchema>;
