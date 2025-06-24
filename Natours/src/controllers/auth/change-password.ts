import { registry } from '@/lib/openapi';
import { changePasswordAuthService } from '@/services/auth/change-password';
import type { Session } from '@/types/auth';
import { passwordSchema } from '@/utils/zod-schemas';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const changePasswordAuthSchema = {
  body: z.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
  }),
  response: z.string(),
};

export const changePasswordAuthRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/auth/change-password',
  tags: ['Auth'],
  summary: 'Change password',
  description: 'Change password for current account',
  request: {
    body: {
      content: {
        'application/json': {
          schema: changePasswordAuthSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: changePasswordAuthSchema.response,
        },
      },
      description: 'Password changed successfully',
    },
  },
});

export const changePasswordAuthRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const session = request.session as Session;
  const body = changePasswordAuthSchema.body.parse(request.body);

  await changePasswordAuthService({
    dbClient,
    payload: {
      session,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    },
  });

  return response.status(StatusCodes.OK).json('Password changed successfully');
};
