import { registry } from '@/lib/openapi';
import { resetPasswordService } from '@/services/auth/reset-password';
import { passwordSchema } from '@/utils/zod-schemas';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const resetPasswordSchema = {
  body: z.object({
    reset_token: z.string(),
    new_password: passwordSchema,
  }),
  response: z.string(),
};

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema.body>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordSchema.response>;

export const resetPasswordRoute = registry.registerPath({
  method: 'post',
  path: '/auth/reset-password',
  tags: ['Auth'],
  summary: 'Reset password',
  description: "Reset the user's password using the temporary reset token",
  request: {
    body: {
      content: {
        'application/json': {
          schema: resetPasswordSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: resetPasswordSchema.response,
        },
      },
      description: 'Password reset successfully',
    },
  },
});

export const resetPasswordRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const { reset_token, new_password } = resetPasswordSchema.body.parse(request.body);

  const result = await resetPasswordService({
    dbClient,
    resetToken: reset_token,
    newPassword: new_password,
  });

  return response.status(StatusCodes.OK).json(result.message);
};
