import { type RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type z } from 'zod';

import { createUserData } from '@/data/users/create-user';
import { userSchema, userSchemaOpenApi } from '@/data/users/schema';
import { registry } from '@/lib/openapi';
import { NotFoundError } from '@/utils/errors';

export const createUserSchema = {
  body: userSchema.pick({
    first_name: true,
    last_name: true,
  }),
  response: userSchemaOpenApi,
};

export type CreateUserBody = z.infer<typeof createUserSchema.body>;
export type CreateUserResponse = z.infer<typeof createUserSchema.response>;

export const createUserRoute = registry.registerPath({
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/api/v1/users',
  tags: ['Users'],
  summary: 'Create a user',
  description: 'Create a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createUserSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: createUserSchema.response,
        },
      },
      description: 'Users created successfully',
    },
  },
});

export const createUserRouteHandler: RequestHandler = async (request, response) => {
  const dbClient = request.dbClient;

  const body = createUserSchema.body.parse(request.body);

  const createdUser = await createUserData({ dbClient, values: body });

  if (!createdUser) throw new NotFoundError('No user created. Please try again.');

  return response.status(StatusCodes.CREATED).json(createdUser);
};
