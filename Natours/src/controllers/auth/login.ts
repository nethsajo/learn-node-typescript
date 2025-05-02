import { type RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { registry } from '@/lib/openapi';
import { loginAuthService } from '@/services/auth/login';
import { emailSchema, passwordSchema } from '@/utils/zod-schemas';

export const loginAuthSchema = {
  body: z.object({ email: emailSchema, password: passwordSchema }),
  response: z.string(),
};

export type LoginAuthBody = z.infer<typeof loginAuthSchema.body>;
export type LoginAuthResponse = z.infer<typeof loginAuthSchema.response>;

export const loginAuthRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/api/v1/auth/login',
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
    201: {
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

  await loginAuthService({ dbClient, payload: body });

  return response.status(StatusCodes.OK).json('Login successfully.');
};
