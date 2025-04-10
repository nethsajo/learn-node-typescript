import { type RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type z } from 'zod';

import { createLocationData } from '@/data/locations/create-location';
import { locationSchema } from '@/data/locations/schema';
import { userSchemaOpenApi } from '@/data/users/schema';
import { NotFoundError } from '@/utils/errors';
import { registry } from '@/utils/registry';

export const createLocationSchema = {
  body: locationSchema.pick({
    name: true,
  }),
  response: userSchemaOpenApi,
};

export type CreateLocationBody = z.infer<typeof createLocationSchema.body>;
export type CreateLocationResponse = z.infer<typeof createLocationSchema.response>;

export const createUserRoute = registry.registerPath({
  method: 'post',
  path: '/api/v1/locations',
  tags: ['Locations'],
  summary: 'Create a location',
  description: 'Create a new location',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createLocationSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: createLocationSchema.response,
        },
      },
      description: 'Users created successfully',
    },
  },
});

export const createLocationRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;

  const body = createLocationSchema.body.parse(request.body);

  const createdLocation = await createLocationData({ dbClient, values: body });

  if (!createdLocation) throw new NotFoundError('No location created. Please try again.');

  return response.status(StatusCodes.CREATED).json(createdLocation);
};
