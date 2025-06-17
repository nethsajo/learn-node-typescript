import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { registry } from '@/lib/openapi';
import { registerAuthService } from '@/services/auth/register';
import { emailSchema, passwordSchema } from '@/utils/zod-schemas';

export const registerAuthSchema = {
  body: z.object({ email: emailSchema, password: passwordSchema }),
  response: z.string(),
};

export type RegisterAuthBody = z.infer<typeof registerAuthSchema.body>;
export type RegisterAuthResponse = z.infer<typeof registerAuthSchema.response>;

export const registerAuthRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  summary: 'Register new user',
  description: 'Register a new user.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerAuthSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: registerAuthSchema.response,
        },
      },
      description: 'Account registered successfully',
    },
  },
});

export const registerAuthRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const body = registerAuthSchema.body.parse(request.body);

  await registerAuthService({ dbClient, payload: body });

  return response.status(StatusCodes.CREATED).json('Account registered successfully');
};
