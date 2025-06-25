import { getUserData } from '@/data/users/get-user';
import { userSchemaOpenApi } from '@/data/users/schema';
import { registry } from '@/lib/openapi';
import type { Session } from '@/types/auth';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { z } from 'zod';

export const getMyProfileSchema = {
  response: userSchemaOpenApi,
};

export type GetMyProfileResponse = z.infer<typeof getMyProfileSchema.response>;

export const getMyProfileRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/me',
  tags: ['Me'],
  summary: 'Retrieve my profile',
  description: 'Retrieve your profile',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getMyProfileSchema.response,
        },
      },
      description: 'My profile retrieved successfully',
    },
  },
});

export const getMyProfileRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const session = request.session as Session;

  const myProfile = await getUserData({ dbClient, accountId: session.accountId });

  return response.status(StatusCodes.OK).json(myProfile);
};
