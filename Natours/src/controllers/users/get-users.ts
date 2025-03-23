import { userSchemaFields, userSchemaOpenApi } from '@/data/users/schema';
import { createDbClient } from '@/db/create-db-client';
import { registry } from '@/utils/registry';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';
import { type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const getUsersSchema = {
  query: listQuerySchema.extend({
    sort_by: userSchemaFields.optional(),
  }),
  response: paginationSchema.extend({
    records: z.array(userSchemaOpenApi),
    total_records: z.number(),
  }),
};

export type GetUsersQuery = z.infer<typeof getUsersSchema.query>;
export type GetUsersResponse = z.infer<typeof getUsersSchema.response>;

export const getUsersRoute = registry.registerPath({
  method: 'get',
  path: '/api/v1/users',
  tags: ['Users'],
  summary: 'List all users',
  description: 'Retrieve a list of all users',
  request: {
    query: getUsersSchema.query,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getUsersSchema.response,
        },
      },
      description: 'Users retrieved successfully',
    },
  },
});

export const getUsersRouteHandler = async (request: Request, response: Response) => {
  const dbClient = createDbClient();

  const data = await dbClient.selectFrom('users').selectAll().execute();

  return response.status(StatusCodes.OK).json({ data });
};
