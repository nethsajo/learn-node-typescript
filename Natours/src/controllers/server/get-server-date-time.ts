import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { getServerDateTimeData } from '@/data/server/get-server-date-time';
import { registry } from '@/lib/openapi';

export const getServerDateTimeSchema = {
  response: z.string(),
};

export type GetServerDateTimeResponse = z.infer<typeof getServerDateTimeSchema.response>;

export const getServerDateTimeRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/server/date-time',
  tags: ['Server'],
  summary: 'Retrieve the server date time',
  description: 'Retrieve the server date time',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getServerDateTimeSchema.response,
        },
      },
      description: 'Server date time retrieved successfully',
    },
  },
});

export const getServerDateTimeRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;

  const serverDateTime = await getServerDateTimeData({ dbClient });

  return response.status(StatusCodes.OK).json({ serverDateTime });
};
