import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import type { Account } from '@/db/schema';

extendZodWithOpenApi(z);

export const accountSchemaObject = {
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
  email: z.string().email().openapi({
    example: 'constNeth@gmail.com',
  }),
  password: z.string().openapi({
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
  }),
};

export const accountSchema = z.object(accountSchemaObject) satisfies z.ZodType<Account>;
export const accountSchemaOpenApi = accountSchema.openapi('Account');
export const accountSchemaFields = z.enum(Object.keys(accountSchemaObject) as [string, ...string[]]);

export type CreateAccount = Omit<Account, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateAccount = Partial<Account>;
