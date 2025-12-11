import { registry } from '@/lib/openapi';
import { loginLinkRequestAuthService } from '@/services/auth/login-link-request';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const loginLinkRequestAuthSchema = {
  body: z.object({
    email: z.string().min(8, 'Invalid credentials').email('Invalid credentials').optional(),
    username: z.string().min(4, 'Invalid credentials').optional(),
  }),
  response: z.string(),
};

export type LoginLinkRequestAuthBody = z.infer<typeof loginLinkRequestAuthSchema.body>;
export type LoginLinkRequestAuthResponse = z.infer<typeof loginLinkRequestAuthSchema.response>;

export const loginLinkRequestAuthRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/login-link/request',
  tags: ['Auth'],
  summary: 'Request a passwordless login link',
  description: 'Send a login link using an email or username.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginLinkRequestAuthSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: loginLinkRequestAuthSchema.response,
        },
      },
      description: 'A login link has been sent to your email.',
    },
  },
});

export const loginRequestLinkAuthRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const body = loginLinkRequestAuthSchema.body.parse(request.body);

  const message = await loginLinkRequestAuthService({ dbClient, payload: body });

  return response.status(StatusCodes.OK).json(message);
};
