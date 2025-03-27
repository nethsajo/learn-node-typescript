import { userSchemaOpenApi } from '@/data/users/schema';
import { createDbClient } from '@/db/create-db-client';
import { registry } from '@/utils/registry';
import { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUserData } from '@/data/users/get-user';

export const getUserSchema = {
  params: z.object({
    id: z.number().openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
  }),
  response: userSchemaOpenApi,
};

export type GetUserParams = z.infer<typeof getUserSchema.params>;
export type GetUsersResponse = z.infer<typeof getUserSchema.response>;

export const getUserRoute = registry.registerPath({
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

export const getUserRouteHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const dbClient = createDbClient();
    const id = Number(request.params.id);

    const user = await getUserData({ dbClient, id });

    return response.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};
