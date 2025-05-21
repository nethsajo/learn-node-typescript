import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import type { Location } from '@/db/schema';

extendZodWithOpenApi(z);

export const locationSchemaObject = {
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
  name: z.string().nullable().openapi({
    example: 'Warehouse',
  }),
};

export const locationSchema = z.object(locationSchemaObject) satisfies z.ZodType<Location>;
export const locationSchemaOpenApi = locationSchema.openapi('User');
export const locationSchemaFields = z.enum(Object.keys(locationSchemaObject) as [string, ...string[]]);

export type CreateLocation = Omit<Location, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
