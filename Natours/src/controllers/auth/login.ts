import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { COOKIE_NAMES } from '@/constants/cookies';
import { registry } from '@/lib/openapi';
import { loginAuthService } from '@/services/auth/login';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '@/utils/cookie-options';
import { envConfig } from '@/env';

export const loginAuthSchema = {
  body: z.object({
    email: z.string().min(8, 'Invalid credentials').email('Invalid credentials'),
    password: z.string().min(8, 'Invalid credentials'),
  }),
  response: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
};

export type LoginAuthBody = z.infer<typeof loginAuthSchema.body>;
export type LoginAuthResponse = z.infer<typeof loginAuthSchema.response>;

export const loginAuthRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Login to account',
  description: 'Login to your account',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginAuthSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: loginAuthSchema.response,
        },
      },
      description: 'Login successfully',
    },
  },
});

export const loginAuthRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const body = loginAuthSchema.body.parse(request.body);

  const { accessToken, refreshToken } = await loginAuthService({ dbClient, payload: body });

  response.cookie(
    COOKIE_NAMES.accessToken,
    accessToken,
    getAccessTokenCookieOptions(envConfig.STAGE)
  );

  response.cookie(
    COOKIE_NAMES.refreshToken,
    refreshToken,
    getRefreshTokenCookieOptions(envConfig.STAGE)
  );

  return response.status(StatusCodes.OK).json({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};
