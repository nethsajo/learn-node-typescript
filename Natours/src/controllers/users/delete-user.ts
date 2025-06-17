import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { deleteUserData } from '@/data/users/delete-user';
import { userSchemaOpenApi } from '@/data/users/schema';
import { registry } from '@/lib/openapi';

export const deleteUserSchema = {
  params: z.object({
    id: z.number().openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
  }),
  response: userSchemaOpenApi,
};

export type DeleteUserParams = z.infer<typeof deleteUserSchema.params>;
export type DeleteUserResponse = z.infer<typeof deleteUserSchema.response>;

export const deleteUserRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'delete',
  path: '/users/{id}',
  tags: ['Users'],
  summary: 'Delete a user',
  description: 'Delete a user',
  request: {
    params: deleteUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: deleteUserSchema.response,
        },
      },
      description: 'User deleted successfully',
    },
  },
});

export const deleteUserRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const id = Number(request.params.id);

  const deletedUser = await deleteUserData({ dbClient, id });

  return response.status(StatusCodes.OK).json({ deletedUser });
};
