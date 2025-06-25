import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { COOKIE_NAMES } from '@/constants/cookies';
import { registry } from '@/lib/openapi';
import { loginAuthService } from '@/services/auth/login';
import { emailSchema, passwordSchema } from '@/utils/zod-schemas';

export const loginAuthSchema = {
  body: z.object({ email: emailSchema, password: passwordSchema }),
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

  response.cookie(COOKIE_NAMES.accessToken, accessToken, {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS
    sameSite: 'strict', // Prevents cross-site request forgery
    path: '/', // Available across the entire site
    maxAge: 30 * 1000, // currently set to 30s but the ideal is 60 * 60 * 24 * 1 (1 day [in seconds])
    signed: true,
  });

  response.cookie(COOKIE_NAMES.refreshToken, refreshToken, {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS
    sameSite: 'strict', // Prevents cross-site request forgery
    path: '/', // Available across the entire site
    maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days (in seconds)
    signed: true,
  });

  return response.status(StatusCodes.OK).json({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};
