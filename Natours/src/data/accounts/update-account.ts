import type { DbClient } from '@/db/create-db-client';
import type { Account } from '@/db/schema';
import type { UpdateAccount } from './schema';
import { NotFoundError } from '@/utils/errors';
import { sql } from 'kysely';

export type UpdateAccountArgs = {
  dbClient: DbClient;
  id: Account['id'];
  values: UpdateAccount;
};

export async function updateAccountData({ dbClient, id, values }: UpdateAccountArgs) {
  await dbClient
    .updateTable('accounts')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .execute();

  const updatedRecord = await dbClient
    .selectFrom('accounts')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirstOrThrow(() => new NotFoundError('Account not found'));

  return updatedRecord;
}
