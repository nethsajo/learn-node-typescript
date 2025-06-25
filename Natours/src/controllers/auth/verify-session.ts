import { registry } from '@/lib/openapi';
import type { Session } from '@/types/auth';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const verifySessionAuthSchema = {
  response: z.object({
    access_token: z.string(),
  }),
};

export const verifySessionAuthRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/auth/verify-session',
  tags: ['Auth'],
  summary: 'Verify session',
  description: 'Verify the session for current account',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: verifySessionAuthSchema.response,
        },
      },
      description: 'Verify session successfully',
    },
  },
});

export const verifySessionAuthRouteHandler: RequestHandler = async (request, response) => {
  const session = request.session as Session;

  return response.status(StatusCodes.OK).json({ access_token: session.accessToken });
};
