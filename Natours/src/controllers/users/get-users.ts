import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { getUsersData, type GetUsersDataArgs } from '@/data/users/get-users';
import { userSchemaFields, userSchemaOpenApi } from '@/data/users/schema';
import { registry } from '@/lib/openapi';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';

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
  security: [{ bearerAuth: [] }],
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

export const getUsersRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;
  const query = getUsersSchema.query.parse(request.query);

  const data = await getUsersData({
    dbClient,
    sortBy: query?.sort_by as GetUsersDataArgs['sortBy'],
    orderBy: query?.order_by,
    limit: query?.limit,
    page: query?.page,
    includeArchive: query?.include_archived === 'true',
  });

  return response.status(StatusCodes.OK).json({ data });
};
