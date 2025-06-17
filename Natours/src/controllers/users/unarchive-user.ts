import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { userSchemaOpenApi } from '@/data/users/schema';
import { updateUserData } from '@/data/users/update-user';
import { registry } from '@/lib/openapi';

export const unarchiveUserSchema = {
  params: z.object({
    id: z.number().openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
  }),
  response: userSchemaOpenApi,
};

export type UnarchiveUserParams = z.infer<typeof unarchiveUserSchema.params>;
export type UnarchiveUserResponse = z.infer<typeof unarchiveUserSchema.response>;

export const unarchiveUserRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/users/{id}/unarchive',
  tags: ['Users'],
  summary: 'Unarchive a user',
  description: 'Unarchive a user',
  request: {
    params: unarchiveUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: unarchiveUserSchema.response,
        },
      },
      description: 'User retrieved successfully',
    },
  },
});

export const unarchiveUserRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const id = Number(request.params.id);

  const unarchivedUser = await updateUserData({ dbClient, id, values: { deleted_at: null } });

  return response.status(StatusCodes.OK).json({ unarchivedUser });
};
