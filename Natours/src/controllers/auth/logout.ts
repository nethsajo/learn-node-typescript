import { COOKIE_NAMES } from '@/constants/cookies';
import { revokeSessionData } from '@/data/sessions/revoke-session';
import { envConfig } from '@/env';
import { registry } from '@/lib/openapi';
import type { Session } from '@/types/auth';
import { getDeleteCookieOptions } from '@/utils/cookie-options';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const logoutSchema = {
  response: z.string(),
};

export const logoutAuthRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'delete',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Logout user',
  description: 'Logout user by invalidating cookies',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: logoutSchema.response,
        },
      },
      description: 'Logout successful',
    },
  },
});

export const logoutAuthRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const session = request.session as Session;

  response.clearCookie(COOKIE_NAMES.accessToken, getDeleteCookieOptions(envConfig.STAGE));

  response.clearCookie(COOKIE_NAMES.refreshToken, getDeleteCookieOptions(envConfig.STAGE));

  await revokeSessionData({ dbClient, accountId: session.accountId });

  return response.status(StatusCodes.OK).json('Logged out successfully');
};
