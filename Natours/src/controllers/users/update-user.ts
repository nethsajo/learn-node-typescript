import { type RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { userSchema, userSchemaOpenApi } from '@/data/users/schema';
import { updateUserData } from '@/data/users/update-user';
import { registry } from '@/utils/registry';

export const updateUserSchema = {
  params: z.object({
    id: z.number().openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
  }),
  body: userSchema
    .pick({
      first_name: true,
      last_name: true,
    })
    .partial(),
  response: userSchemaOpenApi,
};

export const updateUserRoute = registry.registerPath({
  method: 'put',
  path: '/api/v1/users/{id}',
  tags: ['Users'],
  summary: 'Update a user',
  description: 'Update the details of a user',
  request: {
    params: updateUserSchema.params,
    body: {
      content: {
        'application/json': {
          schema: updateUserSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateUserSchema.response,
        },
      },
      description: 'User updated successfully',
    },
  },
});

export const updateUserRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const id = Number(request.params.id);
  const body = updateUserSchema.body.parse(request.body);

  const user = await updateUserData({ dbClient, id, values: body });

  return response.status(StatusCodes.OK).json({ user });
};
