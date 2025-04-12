import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { archiveUserData } from '@/data/users/archive-user';
import { userSchemaOpenApi } from '@/data/users/schema';
import { registry } from '@/utils/registry';

export const archiveUserSchema = {
  params: z.object({
    id: z.number().openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
  }),
  response: userSchemaOpenApi,
};

export type ArchiveUserParams = z.infer<typeof archiveUserSchema.params>;
export type ArchiveUserResponse = z.infer<typeof archiveUserSchema.response>;

export const archiveUserRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'put',
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
      description: 'User archived successfully',
    },
  },
});

export const archiveUserRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const id = Number(request.params.id);

  const archivedUser = await archiveUserData({ dbClient, id });

  return response.status(StatusCodes.OK).json({ archivedUser });
};
