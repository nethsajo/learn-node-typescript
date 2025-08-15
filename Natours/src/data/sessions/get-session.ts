import type { DbClient } from '@/db/create-db-client';
import type { Account } from '@/db/schema';
import { BadRequestError, NotFoundError } from '@/utils/errors';

export type GetSessionDataArgs = {
  dbClient: DbClient;
  id?: number;
  accountId: Account['id'];
};

export async function getSessionData({ dbClient, id, accountId }: GetSessionDataArgs) {
  if (!id && !accountId) {
    throw new BadRequestError('Either id or account id must be provided');
  }

  let query = dbClient.selectFrom('sessions');

  if (id) {
    query = query.where('id', '=', id);
  } else {
    query = query.where('account_id', '=', accountId);
  }

  const record = await query
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Session not found'));

  return record;
}
