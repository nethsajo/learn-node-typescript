import type { DbClient } from '@/db/create-db-client';
import type { Account } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';

export type GetUserDataArgs = {
  dbClient: DbClient;
  accountId: Account['id'];
};

export async function getUserData({ dbClient, accountId }: GetUserDataArgs) {
  const record = await dbClient
    .selectFrom('accounts')
    .leftJoin('users', 'accounts.id', 'users.account_id')
    .where('accounts.id', '=', accountId)
    .select([
      'accounts.id',
      'accounts.email',
      'accounts.created_at',
      'accounts.updated_at',

      'users.first_name',
      'users.last_name',
    ])
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found.'));

  return record;
}
