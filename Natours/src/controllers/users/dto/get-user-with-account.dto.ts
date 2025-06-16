import { accountSchema } from '@/data/accounts/schema';
import { userSchema } from '@/data/users/schema';
import type { z } from 'zod';

export const getUserWithAccountDTOSchema = userSchema
  .omit({ account_id: true })
  .extend({ account: accountSchema });

export type GetUserWithAccountDTO = z.infer<typeof getUserWithAccountDTOSchema>;

export function getUserWithAccountDTO() {}
