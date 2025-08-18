import type { DbClient } from '@/db/create-db-client';
import type { User } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';

export type GetUserDataArgs = {
  dbClient: DbClient;
  accountId: User['id'];
};

export async function getUserData({ dbClient, accountId }: GetUserDataArgs) {
  const record = await dbClient
    .selectFrom('users')
    .leftJoin('accounts', 'users.account_id', 'accounts.id')
    .where('account_id', '=', accountId)
    .selectAll('users')
    .select(['accounts.email'])
    .executeTakeFirstOrThrow(() => new NotFoundError('User not found.'));

  return record;
}
