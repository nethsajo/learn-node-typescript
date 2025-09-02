import { registry } from '@/lib/openapi';
import { verifyResetCodeService } from '@/services/auth/verify-reset-code';
import { emailSchema } from '@/utils/zod-schemas';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const verifyResetCodeSchema = {
  body: z.object({
    email: emailSchema,
    code: z.string().length(6),
  }),
  response: z.object({
    reset_token: z.string(),
  }),
};

export type VerifyResetCodeBody = z.infer<typeof verifyResetCodeSchema.body>;
export type VerifyResetCodeResponse = z.infer<typeof verifyResetCodeSchema.response>;

export const verifyResetCodeRoute = registry.registerPath({
  method: 'post',
  path: '/auth/reset-password/verify',
  tags: ['Auth'],
  summary: 'Verify password reset code',
  description: "Verify the 6-character reset code sent to the user's email.",
  request: {
    body: {
      content: {
        'application/json': {
          schema: verifyResetCodeSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: verifyResetCodeSchema.response,
        },
      },
      description: 'Code verified successfully',
    },
  },
});

export const verifyResetCodeRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const { email, code } = verifyResetCodeSchema.body.parse(request.body);

  const result = await verifyResetCodeService({ dbClient, email, resetCode: code });

  return response.status(StatusCodes.OK).json({ reset_token: result.resetToken });
};
