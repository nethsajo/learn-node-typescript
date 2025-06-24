import { COOKIE_NAMES } from '@/constants/cookies';
import { revokeSessionData } from '@/data/sessions/revoke-session';
import { registry } from '@/lib/openapi';
import type { Session } from '@/types/auth';
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

  response.clearCookie(COOKIE_NAMES.accessToken, {
    path: '/',
    secure: true,
    httpOnly: true,
  });

  response.clearCookie(COOKIE_NAMES.refreshToken, {
    path: '/',
    secure: true,
    httpOnly: true,
  });

  await revokeSessionData({ dbClient, accountId: session.accountId });

  return response.status(StatusCodes.OK).json('Logged out successfully');
};
