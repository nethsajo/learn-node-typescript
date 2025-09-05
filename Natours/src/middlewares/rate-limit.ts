import { envConfig } from '@/env';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'redis';

const client = Redis.createClient({
  url: envConfig.REDIS_URL,
});

await client.connect();

export const rateLimiterMiddleware = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-6',
  legacyHeaders: false,
  keyGenerator: request => request.ip || 'unknown',
  store: new RedisStore({ sendCommand: (...args: string[]) => client.sendCommand(args) }),
});
