import { registry } from '@/lib/openapi';
import { requestPasswordResetService } from '@/services/auth/request-password-reset';
import { emailSchema } from '@/utils/zod-schemas';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const requestPasswordResetSchema = {
  body: z.object({ email: emailSchema }),
  response: z.string(),
};

export type RequestPasswordResetBody = z.infer<typeof requestPasswordResetSchema.body>;
export type RequestPasswordResetResponse = z.infer<typeof requestPasswordResetSchema.response>;

export const requestPasswordResetRoute = registry.registerPath({
  method: 'post',
  path: '/auth/reset-password/request',
  tags: ['Auth'],
  summary: 'Request password reset',
  description: "Send a password reset code to the user's email address.",
  request: {
    body: {
      content: {
        'application/json': {
          schema: requestPasswordResetSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: requestPasswordResetSchema.response,
        },
      },
      description: 'Password reset request processed',
    },
  },
});

export const requestPasswordResetRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const { email } = requestPasswordResetSchema.body.parse(request.body);

  const result = await requestPasswordResetService({ dbClient, email });

  return response.status(StatusCodes.OK).json(result.message);
};
