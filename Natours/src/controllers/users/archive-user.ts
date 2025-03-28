import { userSchemaOpenApi } from '@/data/users/schema';
import { registry } from '@/utils/registry';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { createDbClient } from '@/db/create-db-client';
import { archiveUserData } from '@/data/users/archive-user';
import { StatusCodes } from 'http-status-codes';

export const archiveUserSchema = {
  params: z.object({
    id: z.number().openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
  }),
  response: userSchemaOpenApi,
};

export type ArchiveUserParams = z.infer<typeof archiveUserSchema.params>;
export type ArchiveUserResponse = z.infer<typeof archiveUserSchema.response>;

export const archiveUserRoute = registry.registerPath({
  method: 'delete',
  path: '/api/v1/users/{id}/archive',
  tags: ['Users'],
  summary: 'Archive a user',
  description: 'Archive a user',
  request: {
    params: archiveUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: archiveUserSchema.response,
        },
      },
      description: 'User retrieved successfully',
    },
  },
});

export const archiveUserRouteHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const dbClient = createDbClient();
    const id = Number(request.params.id);

    const user = await archiveUserData({ dbClient, id });

    return response.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};
