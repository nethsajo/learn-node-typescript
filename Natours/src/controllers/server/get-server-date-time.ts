import { getServerDateTimeData } from '@/data/server/get-server-date-time';
import { registry } from '@/utils/registry';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const getServerDateTimeSchema = {
  response: z.string(),
};

export type GetServerDateTimeResponse = z.infer<typeof getServerDateTimeSchema.response>;

export const getServerDateTimeRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/api/v1/server/date-time',
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
