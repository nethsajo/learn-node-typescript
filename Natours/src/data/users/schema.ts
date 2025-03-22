import { type User } from '@/db/schema';
import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

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
export const userSchemaOpenApi = userSchema.openapi({ ref: 'User' });
