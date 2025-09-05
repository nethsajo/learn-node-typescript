import type { DbClient } from '@/db/create-db-client';
import type { Account } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';
import { sql } from 'kysely';

export type ClearResetCodeDataArgs = {
  dbClient: DbClient;
  accountId: Account['id'];
};

export async function clearResetCodeData({ dbClient, accountId }: ClearResetCodeDataArgs) {
  await dbClient
    .updateTable('accounts')
    .set({
      reset_code: null,
      reset_code_expires: null,
      reset_attempts: 0,
      reset_blocked_until: null,
      updated_at: sql`NOW()`,
    })
    .where('id', '=', accountId)
    .where('deleted_at', 'is', null)
    .execute();

  const updatedAccount = await dbClient
    .selectFrom('accounts')
    .selectAll()
    .where('id', '=', accountId)
    .executeTakeFirstOrThrow(() => new NotFoundError('Account not found.'));

  return updatedAccount;
}

export type ClearResetCodeDataResponse = Awaited<ReturnType<typeof clearResetCodeData>>;
