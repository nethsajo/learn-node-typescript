import { type RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { getUserData } from '@/data/users/get-user';
import { userSchemaOpenApi } from '@/data/users/schema';
import { registry } from '@/lib/openapi';

export const getUserSchema = {
  params: z.object({
    id: z.number().openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
  }),
  response: userSchemaOpenApi,
};

export type GetUserParams = z.infer<typeof getUserSchema.params>;
export type GetUsersResponse = z.infer<typeof getUserSchema.response>;

export const getUserRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/api/v1/users/{id}',
  tags: ['Users'],
  summary: 'Retrieve a user',
  description: 'Retrieve the details of a user',
  request: {
    params: getUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getUserSchema.response,
        },
      },
      description: 'User retrieved successfully',
    },
  },
});

export const getUserRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const id = Number(request.params.id);

  const user = await getUserData({ dbClient, id });

  return response.status(StatusCodes.OK).json({ user });
};
