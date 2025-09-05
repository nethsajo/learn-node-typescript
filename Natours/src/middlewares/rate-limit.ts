import { envConfig } from '@/env';
import { TooManyRequestsError } from '@/utils/errors';
import type { Request } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'redis';

const client = Redis.createClient({
  url: envConfig.REDIS_URL,
});

await client.connect();

export const rateLimiterMiddleware = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (request: Request) => {
    const ipKey = ipKeyGenerator(request.ip as string);
    return request.session?.accountId ? `${ipKey}-${request.session?.accountId}` : ipKey;
  },
  handler: () => {
    throw new TooManyRequestsError('Too many requests. Please try again later.');
  },
  store: new RedisStore({ sendCommand: (...args: string[]) => client.sendCommand(args) }),
});
