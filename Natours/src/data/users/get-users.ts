import type { DbClient } from '@/db/create-db-client';
import type { Account, User } from '@/db/schema';

import { makeDefaultDataListReturn } from '../make-default-list-return';

export type GetUsersDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  sortBy?: keyof (User & Pick<Account, 'email'>);
  orderBy?: 'asc' | 'desc';
  includeArchive?: boolean;
};

export async function getUsersData({
  dbClient,
  limit = 25,
  page = 1,
  sortBy = 'created_at',
  orderBy = 'desc',
  includeArchive = false,
}: GetUsersDataArgs) {
  let query = dbClient.selectFrom('users').leftJoin('accounts', 'users.account_id', 'accounts.id');

  if (!includeArchive) {
    query = query.where('users.deleted_at', 'is', null);
  }

  const recordQuery = query
    .select([
      'users.id',
      'users.created_at',
      'users.updated_at',
      'users.deleted_at',
      'users.first_name',
      'users.last_name',
      /* accounts */
      'accounts.id as account_id',
      'accounts.created_at as account_created_at',
      'accounts.updated_at as account_updated_at',
      'accounts.deleted_at as account_deleted_at',
      'accounts.email as account_email',
    ])
    .limit(limit)
    .offset((page - 1) * limit);

  const records = await recordQuery.execute();

  const allRecords = await query
    .select(eb => eb.fn.count('users.id').as('total_records'))
    .executeTakeFirst();

  return makeDefaultDataListReturn({
    records,
    totalRecords: Number(allRecords?.total_records) ?? 0,
    limit,
    page,
  });
}
