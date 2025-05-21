import { sql } from 'kysely';

import type { DbClient } from '@/db/create-db-client';
import type { User } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';

import type { UpdateUser } from './schema';

export type UpdateUserDataArgs = {
  dbClient: DbClient;
  accountId: User['id'];
  values: UpdateUser;
};

export async function updateUserData({ dbClient, accountId, values }: UpdateUserDataArgs) {
  await dbClient
    .updateTable('users')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('account_id', '=', accountId)
    .execute();

  const updatedRecord = await dbClient
    .selectFrom('users')
    .selectAll()
    .where('account_id', '=', accountId)
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found'));

  return updatedRecord;
}
