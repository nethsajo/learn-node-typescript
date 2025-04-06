import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { type User } from '@/db/schema';

extendZodWithOpenApi(z);

export const userSchemaObject = {
  id: z.number(),
  created_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  updated_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  deleted_at: z.union([z.coerce.date(), z.string()]).nullable().openapi({
    example: new Date().toISOString(),
  }),
  first_name: z.string().nullable().openapi({
    example: 'Jan Kenneth',
  }),
  last_name: z.string().nullable().openapi({
    example: 'Sajo',
  }),
};

export const userSchema = z.object(userSchemaObject) satisfies z.ZodType<User>;
export const userSchemaOpenApi = userSchema.openapi('User');
export const userSchemaFields = z.enum(Object.keys(userSchemaObject) as [string, ...string[]]);

export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateUser = Partial<User>;
