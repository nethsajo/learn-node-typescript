import type { DbClient } from '@/db/create-db-client';
import { BadRequestError, NotFoundError } from '@/utils/errors';

export type GetSessionDataArgs = {
  dbClient: DbClient;
  id?: number;
  accountId?: number; // Make this optional
};

export async function getSessionData({ dbClient, id, accountId }: GetSessionDataArgs) {
  if (!id && !accountId) {
    throw new BadRequestError('Either id or account id must be provided');
  }

  let query = dbClient.selectFrom('sessions');

  if (id) {
    query = query.where('id', '=', id);
  }

  if (accountId) {
    query = query.where('account_id', '=', accountId);
  }

  const record = await query
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Session not found'));

  return record;
}
